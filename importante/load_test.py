"""
load_test.py — Load tester para MecanicCompany Backend
Uso:
    pip install aiohttp
    python load_test.py

Ajusta BASE_URL y las fases de carga según tu entorno.
"""

import asyncio
import aiohttp
import time
import statistics
from dataclasses import dataclass, field
from typing import List

# ─── Configuración ────────────────────────────────────────────────────────────
BASE_URL = "http://192.168.70.215:3000/api"   # Cambia a http://localhost:3000/api si pruebas local

# Credenciales de un admin/mecánico válido para endpoints protegidos
TEST_EMAIL    = "steven.cabascango@mecanic.com"  # Cambia por un correo real de tu BD
TEST_PASSWORD = "Steven_123"               # Cambia por la contraseña real

# Fases de carga: (usuarios_concurrentes, requests_por_usuario)
FASES = [
    (5,   10),   # Fase 1 — Calentamiento: 5 usuarios, 10 req c/u  =   50 total
    (20,  10),   # Fase 2 — Moderado:     20 usuarios, 10 req c/u  =  200 total
    (50,  10),   # Fase 3 — Alto:         50 usuarios, 10 req c/u  =  500 total
    (100, 10),   # Fase 4 — Estrés:      100 usuarios, 10 req c/u  = 1000 total
    (200, 10),   # Fase 5 — Límite:      200 usuarios, 10 req c/u  = 2000 total
]

TIMEOUT_SEG = 10  # Segundos antes de considerar un request como timeout


# ─── Estructuras de resultado ─────────────────────────────────────────────────
@dataclass
class ResultadoReq:
    endpoint: str
    status: int           # 0 = error de red / timeout
    duracion_ms: float
    error: str = ""


@dataclass
class ResumenFase:
    usuarios: int
    total_req: int
    exitosos: int = 0
    fallidos: int = 0
    timeouts: int = 0
    duraciones: List[float] = field(default_factory=list)
    duracion_total_seg: float = 0.0

    @property
    def tasa_exito(self):
        return (self.exitosos / self.total_req * 100) if self.total_req else 0

    @property
    def rps(self):
        return self.total_req / self.duracion_total_seg if self.duracion_total_seg else 0

    @property
    def p50(self):
        return statistics.median(self.duraciones) if self.duraciones else 0

    @property
    def p95(self):
        if not self.duraciones:
            return 0
        s = sorted(self.duraciones)
        idx = int(len(s) * 0.95)
        return s[min(idx, len(s) - 1)]

    @property
    def p99(self):
        if not self.duraciones:
            return 0
        s = sorted(self.duraciones)
        idx = int(len(s) * 0.99)
        return s[min(idx, len(s) - 1)]


# ─── Endpoints a probar ───────────────────────────────────────────────────────
# Cada tarea recibe la sesión aiohttp y el token JWT (puede ser vacío si no aplica)

async def req_login(session: aiohttp.ClientSession, _token: str) -> ResultadoReq:
    """POST /auth/login — endpoint público"""
    start = time.perf_counter()
    try:
        async with session.post(
            f"{BASE_URL}/auth/login",
            json={"correoEmpresarial": TEST_EMAIL, "contrasena": TEST_PASSWORD},
        ) as r:
            duracion = (time.perf_counter() - start) * 1000
            return ResultadoReq("/auth/login", r.status, duracion)
    except asyncio.TimeoutError:
        return ResultadoReq("/auth/login", 0, TIMEOUT_SEG * 1000, "timeout")
    except Exception as e:
        return ResultadoReq("/auth/login", 0, (time.perf_counter() - start) * 1000, str(e))


async def req_solicitudes(session: aiohttp.ClientSession, token: str) -> ResultadoReq:
    """GET /solicitudes — endpoint protegido"""
    start = time.perf_counter()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        async with session.get(f"{BASE_URL}/solicitudes", headers=headers) as r:
            duracion = (time.perf_counter() - start) * 1000
            return ResultadoReq("/solicitudes", r.status, duracion)
    except asyncio.TimeoutError:
        return ResultadoReq("/solicitudes", 0, TIMEOUT_SEG * 1000, "timeout")
    except Exception as e:
        return ResultadoReq("/solicitudes", 0, (time.perf_counter() - start) * 1000, str(e))


async def req_mecanicos(session: aiohttp.ClientSession, token: str) -> ResultadoReq:
    """GET /mecanicos — endpoint protegido"""
    start = time.perf_counter()
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    try:
        async with session.get(f"{BASE_URL}/mecanicos", headers=headers) as r:
            duracion = (time.perf_counter() - start) * 1000
            return ResultadoReq("/mecanicos", r.status, duracion)
    except asyncio.TimeoutError:
        return ResultadoReq("/mecanicos", 0, TIMEOUT_SEG * 1000, "timeout")
    except Exception as e:
        return ResultadoReq("/mecanicos", 0, (time.perf_counter() - start) * 1000, str(e))


# Lista de tareas a ejecutar en round-robin por cada "usuario"
TAREAS = [req_login, req_solicitudes, req_mecanicos]


# ─── Obtener token JWT ────────────────────────────────────────────────────────
async def obtener_token(session: aiohttp.ClientSession) -> str:
    try:
        async with session.post(
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


# ─── Simular un usuario ───────────────────────────────────────────────────────
async def simular_usuario(
    session: aiohttp.ClientSession,
    token: str,
    n_requests: int,
) -> List[ResultadoReq]:
    resultados = []
    for i in range(n_requests):
        tarea = TAREAS[i % len(TAREAS)]
        resultado = await tarea(session, token)
        resultados.append(resultado)
        await asyncio.sleep(0.05)  # pausa mínima entre requests del mismo "usuario"
    return resultados


# ─── Ejecutar una fase ────────────────────────────────────────────────────────
async def ejecutar_fase(usuarios: int, req_por_usuario: int, token: str) -> ResumenFase:
    total = usuarios * req_por_usuario
    resumen = ResumenFase(usuarios=usuarios, total_req=total)

    timeout = aiohttp.ClientTimeout(total=TIMEOUT_SEG)
    connector = aiohttp.TCPConnector(limit=usuarios + 10)

    inicio = time.perf_counter()
    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        tareas = [simular_usuario(session, token, req_por_usuario) for _ in range(usuarios)]
        resultados_lista = await asyncio.gather(*tareas, return_exceptions=True)

    resumen.duracion_total_seg = time.perf_counter() - inicio

    for grupo in resultados_lista:
        if isinstance(grupo, Exception):
            resumen.fallidos += req_por_usuario
            continue
        for r in grupo:
            if r.error == "timeout":
                resumen.timeouts += 1
                resumen.fallidos += 1
            elif r.status == 0 or r.status >= 500:
                resumen.fallidos += 1
            else:
                resumen.exitosos += 1
                resumen.duraciones.append(r.duracion_ms)

    return resumen


# ─── Imprimir resultado de fase ───────────────────────────────────────────────
def imprimir_resumen(fase_num: int, r: ResumenFase):
    estado = "OK" if r.tasa_exito >= 95 else ("DEGRADADO" if r.tasa_exito >= 70 else "COLAPSADO")
    print(f"\n{'='*60}")
    print(f" FASE {fase_num} — {r.usuarios} usuarios concurrentes  [{estado}]")
    print(f"{'='*60}")
    print(f"  Total requests    : {r.total_req}")
    print(f"  Exitosos          : {r.exitosos}  ({r.tasa_exito:.1f}%)")
    print(f"  Fallidos          : {r.fallidos - r.timeouts}")
    print(f"  Timeouts          : {r.timeouts}")
    print(f"  Duración total    : {r.duracion_total_seg:.2f}s")
    print(f"  Throughput (RPS)  : {r.rps:.1f} req/seg")
    if r.duraciones:
        print(f"  Latencia promedio : {statistics.mean(r.duraciones):.0f} ms")
        print(f"  Latencia P50      : {r.p50:.0f} ms")
        print(f"  Latencia P95      : {r.p95:.0f} ms")
        print(f"  Latencia P99      : {r.p99:.0f} ms")
        print(f"  Latencia máxima   : {max(r.duraciones):.0f} ms")


# ─── Main ─────────────────────────────────────────────────────────────────────
async def main():
    print("=" * 60)
    print("  LOAD TEST — MecanicCompany Backend")
    print(f"  Target: {BASE_URL}")
    print("=" * 60)

    # Obtener token una sola vez para las fases
    print("\n[*] Obteniendo token JWT para endpoints protegidos...")
    async with aiohttp.ClientSession() as session:
        token = await obtener_token(session)

    if token:
        print(f"[+] Token obtenido correctamente")
    else:
        print("[!] No se pudo obtener token — endpoints protegidos recibirán 401 (igual se mide rendimiento)")

    resultados_fases = []
    punto_quiebre = None

    for i, (usuarios, req_x_usuario) in enumerate(FASES, 1):
        print(f"\n[*] Iniciando fase {i}: {usuarios} usuarios × {req_x_usuario} req = {usuarios * req_x_usuario} total...")
        resumen = await ejecutar_fase(usuarios, req_x_usuario, token)
        imprimir_resumen(i, resumen)
        resultados_fases.append(resumen)

        # Detectar punto de quiebre: < 70% de éxito o P95 > 5 segundos
        if resumen.tasa_exito < 70 or resumen.p95 > 5000:
            if punto_quiebre is None:
                punto_quiebre = resumen.usuarios
            print(f"\n  [!] Degradacion severa detectada — deteniendo prueba")
            break

        await asyncio.sleep(2)  # pausa entre fases para que el servidor se recupere

    # Resumen final
    print(f"\n{'='*60}")
    print("  RESUMEN FINAL")
    print(f"{'='*60}")
    print(f"  {'Usuarios':<12} {'RPS':<10} {'Éxito%':<10} {'P95 ms':<12} {'Estado'}")
    print(f"  {'-'*55}")
    for r in resultados_fases:
        estado = "OK" if r.tasa_exito >= 95 else ("DEGRADADO" if r.tasa_exito >= 70 else "COLAPSADO")
        print(f"  {r.usuarios:<12} {r.rps:<10.1f} {r.tasa_exito:<10.1f} {r.p95:<12.0f} {estado}")

    if punto_quiebre:
        print(f"\n  Punto de quiebre estimado: ~{punto_quiebre} usuarios concurrentes")
    else:
        max_u = resultados_fases[-1].usuarios
        print(f"\n  El servidor aguantó todas las fases (máx {max_u} usuarios concurrentes)")

    print("\n[!] Nota: estos resultados dependen de la red, la BD y el hardware.")
    print("    Para pruebas en producción considera herramientas como k6 o Locust.")


if __name__ == "__main__":
    asyncio.run(main())
