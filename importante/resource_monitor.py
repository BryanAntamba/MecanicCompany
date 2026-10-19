"""
resource_monitor.py — Monitor de CPU, RAM y handles del proceso backend
Uso:
    pip install psutil aiohttp
    python resource_monitor.py

Requisitos:
    - El backend debe estar corriendo antes de ejecutar este script
    - El proceso Node.js del backend debe ser detectable por psutil

Qué mide:
    - CPU %        : uso del núcleo(s) por el proceso Node.js del backend
    - RAM (RSS)    : memoria residente (RAM física usada por el proceso)
    - RAM (VMS)    : memoria virtual total asignada al proceso
    - Handles/FDs  : archivos y sockets abiertos (indica leaks de conexiones)
    - Threads      : hilos del proceso Node.js
    - Carga de red : requests HTTP simulados mientras se monitorea (igual que load_test.py)
"""

import asyncio
import aiohttp
import psutil
import time
import statistics
import sys
from dataclasses import dataclass, field
from typing import List, Optional

# ─── Configuración ────────────────────────────────────────────────────────────
BASE_URL      = "http://192.168.70.215:3000/api"
TEST_EMAIL    = "steven.cabascango@mecanic.com"
TEST_PASSWORD = "Steven_123"

# Intervalo de muestreo del monitor (segundos)
INTERVALO_MUESTREO = 1.0

# Fases de carga mientras se monitorea
FASES_CARGA = [
    (0,   30),   # Fase reposo  — sin carga,  30 seg de baseline
    (10,  30),   # Fase baja    — 10 usuarios, 30 seg
    (50,  30),   # Fase media   — 50 usuarios, 30 seg
    (100, 30),   # Fase alta    — 100 usuarios, 30 seg
    (0,   20),   # Fase reposo2 — sin carga,  20 seg (mide recuperación)
]

TIMEOUT_REQ = 10  # Timeout por request en segundos


# ─── Estructura de muestra ────────────────────────────────────────────────────
@dataclass
class Muestra:
    timestamp: float
    cpu_pct: float
    ram_rss_mb: float
    ram_vms_mb: float
    handles: int
    threads: int
    fase: str


# ─── Buscar proceso Node.js del backend ───────────────────────────────────────
def encontrar_proceso_backend() -> Optional[psutil.Process]:
    """
    Busca el proceso Node.js que escucha en el puerto 3000.
    Devuelve el proceso o None si no se encuentra.
    """
    puerto_objetivo = 3000
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            nombre = (proc.info['name'] or '').lower()
            if 'node' not in nombre:
                continue
            # Verifica que tenga una conexión en el puerto 3000
            conexiones = proc.net_connections(kind='inet')
            for conn in conexiones:
                if conn.laddr and conn.laddr.port == puerto_objetivo:
                    return proc
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    # Fallback: busca cualquier proceso node.exe / node
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            nombre = (proc.info['name'] or '').lower()
            if nombre in ('node.exe', 'node'):
                return proc
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    return None


# ─── Obtener token JWT ────────────────────────────────────────────────────────
async def obtener_token() -> str:
    try:
        async with aiohttp.ClientSession() as s:
            async with s.post(
                f"{BASE_URL}/auth/login",
                json={"correoEmpresarial": TEST_EMAIL, "contrasena": TEST_PASSWORD},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as r:
                if r.status == 200:
                    data = await r.json()
                    return data.get("token", "")
    except Exception:
        pass
    return ""


# ─── Generador de carga HTTP ──────────────────────────────────────────────────
async def usuario_carga(session: aiohttp.ClientSession, token: str, duracion_seg: float):
    """Envía requests en loop durante `duracion_seg` segundos."""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    fin = time.perf_counter() + duracion_seg
    endpoints = [
        ("POST", f"{BASE_URL}/auth/login",
         {"correoEmpresarial": TEST_EMAIL, "contrasena": TEST_PASSWORD}),
        ("GET",  f"{BASE_URL}/solicitudes", None),
        ("GET",  f"{BASE_URL}/mecanicos",   None),
    ]
    idx = 0
    while time.perf_counter() < fin:
        method, url, body = endpoints[idx % len(endpoints)]
        try:
            if method == "POST":
                await session.post(url, json=body,
                                   timeout=aiohttp.ClientTimeout(total=TIMEOUT_REQ))
            else:
                await session.get(url, headers=headers,
                                  timeout=aiohttp.ClientTimeout(total=TIMEOUT_REQ))
        except Exception:
            pass
        idx += 1
        await asyncio.sleep(0.05)


async def ejecutar_carga(usuarios: int, duracion_seg: float, token: str):
    """Lanza `usuarios` corrutinas de carga simultáneas durante `duracion_seg` seg."""
    if usuarios == 0:
        await asyncio.sleep(duracion_seg)
        return
    connector = aiohttp.TCPConnector(limit=usuarios + 10)
    async with aiohttp.ClientSession(connector=connector) as session:
        tareas = [usuario_carga(session, token, duracion_seg) for _ in range(usuarios)]
        await asyncio.gather(*tareas, return_exceptions=True)


# ─── Monitor de recursos (corre en hilo separado via run_in_executor) ─────────
def muestrear_proceso(
    proc: psutil.Process,
    muestras: List[Muestra],
    stop_event: asyncio.Event,
    loop: asyncio.AbstractEventLoop,
    fase_actual: list,   # [str] — mutable para que el hilo lea la fase corriente
):
    """Función síncrona que muestrea el proceso cada INTERVALO_MUESTREO segundos."""
    # Primera llamada a cpu_percent establece la línea base (devuelve 0.0 la primera vez)
    try:
        proc.cpu_percent(interval=None)
    except Exception:
        pass

    while not loop.is_closed():
        if stop_event.is_set():
            break
        try:
            cpu  = proc.cpu_percent(interval=INTERVALO_MUESTREO)
            mem  = proc.memory_info()
            rss  = mem.rss / (1024 ** 2)   # Bytes → MB
            vms  = mem.vms / (1024 ** 2)
            try:
                handles = proc.num_handles() if hasattr(proc, 'num_handles') else proc.num_fds()
            except Exception:
                handles = -1
            threads = proc.num_threads()
            muestra = Muestra(
                timestamp  = time.time(),
                cpu_pct    = cpu,
                ram_rss_mb = rss,
                ram_vms_mb = vms,
                handles    = handles,
                threads    = threads,
                fase       = fase_actual[0],
            )
            muestras.append(muestra)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            break


# ─── Imprimir reporte final ───────────────────────────────────────────────────
def imprimir_reporte(muestras: List[Muestra], proc_info: dict):
    print("\n" + "=" * 65)
    print("  REPORTE FINAL — Monitor de Recursos MecanicCompany Backend")
    print("=" * 65)
    print(f"  Proceso  : {proc_info.get('name')}  (PID {proc_info.get('pid')})")
    print(f"  Muestras : {len(muestras)}")

    if not muestras:
        print("  Sin muestras registradas.")
        return

    # Agrupa por fase
    fases_unicas = list(dict.fromkeys(m.fase for m in muestras))

    for fase in fases_unicas:
        grupo = [m for m in muestras if m.fase == fase]
        cpus  = [m.cpu_pct    for m in grupo]
        rss   = [m.ram_rss_mb for m in grupo]
        hdls  = [m.handles    for m in grupo if m.handles >= 0]

        print(f"\n  ── {fase} ──")
        print(f"    Muestras     : {len(grupo)}")
        print(f"    CPU  prom    : {statistics.mean(cpus):.1f}%   max: {max(cpus):.1f}%")
        print(f"    RAM  prom    : {statistics.mean(rss):.1f} MB  max: {max(rss):.1f} MB  min: {min(rss):.1f} MB")
        if hdls:
            print(f"    Handles      : prom {statistics.mean(hdls):.0f}   max {max(hdls)}   min {min(hdls)}")
        print(f"    Threads      : {grupo[-1].threads}")

    # Global
    all_cpu = [m.cpu_pct    for m in muestras]
    all_rss = [m.ram_rss_mb for m in muestras]
    all_hdl = [m.handles    for m in muestras if m.handles >= 0]

    print(f"\n  ── GLOBAL ──")
    print(f"    CPU  máx     : {max(all_cpu):.1f}%")
    print(f"    RAM  máx     : {max(all_rss):.1f} MB")
    print(f"    RAM  inicial : {all_rss[0]:.1f} MB")
    print(f"    RAM  final   : {all_rss[-1]:.1f} MB")
    delta_ram = all_rss[-1] - all_rss[0]
    print(f"    Delta RAM    : {delta_ram:+.1f} MB  {'(posible leak)' if delta_ram > 50 else '(normal)'}")
    if all_hdl:
        print(f"    Handles max  : {max(all_hdl)}  {'(revisar posible leak)' if max(all_hdl) > 500 else '(normal)'}")

    # Valoracion
    # psutil.cpu_percent() en un proceso devuelve % por nucleo (puede superar 100% en multi-core).
    # Normalizamos contra el total de nucleos logicos para obtener el % real de uso de la maquina.
    num_cpus = psutil.cpu_count(logical=True) or 1
    cpu_max = max(all_cpu)
    cpu_max_normalizado = cpu_max / num_cpus   # % real del sistema
    ram_max = max(all_rss)

    print("\n  ── VALORACION ──")
    print(f"    Nucleos logicos : {num_cpus}")
    print(f"    CPU max (raw)   : {cpu_max:.0f}%  =>  {cpu_max_normalizado:.0f}% del sistema total")
    print(f"    Nota: psutil reporta CPU por nucleo. 150% en 4 nucleos = 37.5% del sistema.")
    if cpu_max_normalizado < 25:
        print(f"    CPU   : [EXCELENTE] {cpu_max_normalizado:.0f}% del sistema — amplio margen de capacidad")
    elif cpu_max_normalizado < 50:
        print(f"    CPU   : [ACEPTABLE] {cpu_max_normalizado:.0f}% del sistema — tolerable bajo carga alta")
    elif cpu_max_normalizado < 75:
        print(f"    CPU   : [ADVERTENCIA] {cpu_max_normalizado:.0f}% del sistema — cerca del limite bajo pico")
    else:
        print(f"    CPU   : [CRITICO] {cpu_max_normalizado:.0f}% del sistema — el servidor esta saturado")

    if ram_max < 150:
        print(f"    RAM   : [EXCELENTE] Maximo {ram_max:.0f} MB — muy eficiente")
    elif ram_max < 300:
        print(f"    RAM   : [ACEPTABLE] Maximo {ram_max:.0f} MB — dentro de lo normal para Node.js")
    elif ram_max < 500:
        print(f"    RAM   : [ADVERTENCIA] Maximo {ram_max:.0f} MB — consumo elevado")
    else:
        print(f"    RAM   : [CRITICO] Maximo {ram_max:.0f} MB — posible memory leak")

    nota_bateria = (
        "Bajo: CPU baja = poca generacion de calor = menor drenaje de bateria"
        if cpu_max < 40 else
        "Moderado: CPU elevada bajo carga puede calentar el servidor si es un dispositivo movil"
    )
    print(f"    Bateria (estimado): {nota_bateria}")

    print("\n" + "=" * 65)


# ─── Main ─────────────────────────────────────────────────────────────────────
async def main():
    print("=" * 65)
    print("  RESOURCE MONITOR — MecanicCompany Backend (CPU + RAM + Handles)")
    print(f"  Target: {BASE_URL}")
    print("=" * 65)

    # Buscar proceso backend
    print("\n[*] Buscando proceso Node.js del backend...")
    proc = encontrar_proceso_backend()
    if proc is None:
        print("[ERROR] No se encontro el proceso Node.js.")
        print("        Asegurate de que el backend este corriendo en el puerto 3000.")
        sys.exit(1)

    proc_info = {"pid": proc.pid, "name": proc.name()}
    print(f"[OK] Proceso encontrado: {proc_info['name']}  PID {proc_info['pid']}")

    # Obtener token
    print("[*] Obteniendo token JWT...")
    token = await obtener_token()
    if token:
        print(f"[OK] Token obtenido.")
    else:
        print("[AVISO] No se pudo obtener token. Los endpoints protegidos podrian fallar.")

    muestras: List[Muestra] = []
    stop_event = asyncio.Event()
    fase_actual = ["Iniciando"]
    loop = asyncio.get_running_loop()

    # Lanza el monitor en un hilo separado (psutil es bloqueante)
    import concurrent.futures
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    monitor_future = loop.run_in_executor(
        executor,
        muestrear_proceso, proc, muestras, stop_event, loop, fase_actual
    )

    # Ejecuta las fases de carga mientras el monitor corre en paralelo
    for i, (usuarios, duracion) in enumerate(FASES_CARGA):
        nombre_fase = (
            f"Reposo (baseline)" if usuarios == 0 and i == 0 else
            f"Reposo (recuperacion)" if usuarios == 0 else
            f"Carga {usuarios} usuarios"
        )
        fase_actual[0] = nombre_fase
        print(f"\n[Fase {i+1}/{len(FASES_CARGA)}] {nombre_fase}  —  {duracion}s")

        await ejecutar_carga(usuarios, duracion, token)

        # Muestra snapshot al final de cada fase
        if muestras:
            ultimas = muestras[-3:] if len(muestras) >= 3 else muestras
            cpu_snap = statistics.mean(m.cpu_pct    for m in ultimas)
            ram_snap = statistics.mean(m.ram_rss_mb for m in ultimas)
            print(f"    Snapshot: CPU {cpu_snap:.1f}%  RAM {ram_snap:.1f} MB")

    # Detiene el monitor
    stop_event.set()
    try:
        await asyncio.wait_for(monitor_future, timeout=INTERVALO_MUESTREO + 1)
    except asyncio.TimeoutError:
        pass
    executor.shutdown(wait=False)

    # Reporte final
    imprimir_reporte(muestras, proc_info)


if __name__ == "__main__":
    asyncio.run(main())
