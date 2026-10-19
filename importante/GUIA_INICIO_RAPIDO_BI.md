# 🚀 GUÍA DE INICIO RÁPIDO - METABASE BI

## ⏱️ Tiempo estimado: 15 minutos

---

## 📋 REQUISITOS PREVIOS

### 1. Verificar PostgreSQL
Tu base de datos debe estar corriendo. Verifica desde la terminal:

```powershell
cd backend
npx prisma db pull
```

Si funciona, ✅ tu base de datos está lista.

### 2. Instalar Docker Desktop
- **Descargar:** https://www.docker.com/products/docker-desktop
- **Instalar** y **reiniciar** tu computadora
- **Abrir Docker Desktop** y dejarlo corriendo

---

## 🎯 INSTALACIÓN EN 3 PASOS

### PASO 1: Ejecutar Script de Instalación

Abre **PowerShell** en la carpeta del proyecto y ejecuta:

```powershell
.\iniciar-metabase.ps1
```

**Nota:** Si aparece error de permisos, ejecuta primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

El script hará:
- ✅ Verificar Docker
- ✅ Descargar Metabase
- ✅ Iniciar contenedor
- ✅ Abrir navegador automáticamente

---

### PASO 2: Crear Usuario Administrador

Cuando se abra `http://localhost:3001`:

1. **Idioma:** Selecciona **Español**
2. **Crea tu cuenta:**
   - Nombre: `Administrador`
   - Email: `admin@mecanic.com`
   - Contraseña: `[tu contraseña segura]`
3. Click en **Siguiente**

---

### PASO 3: Conectar a PostgreSQL

#### 3.1 Crear Usuario de Solo Lectura (IMPORTANTE - SEGURIDAD)

Abre una terminal y conéctate a PostgreSQL:

```powershell
# Opción 1: Si tienes psql instalado
psql -U postgres -d [nombre_de_tu_base_de_datos]

# Opción 2: Desde Docker (si usas PostgreSQL en Docker)
docker exec -it nombre_contenedor_postgres psql -U postgres -d nombre_bd
```

Ejecuta el script SQL:
```powershell
# Pega el contenido del archivo crear-usuario-readonly.sql
```

O simplemente copia y pega este comando corto:
```sql
CREATE USER metabase_readonly WITH PASSWORD 'password_seguro_123';
GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;
GRANT USAGE ON SCHEMA public TO metabase_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_readonly;
```

**⚠️ IMPORTANTE:** Cambia `password_seguro_123` por una contraseña fuerte.

#### 3.2 Configurar Conexión en Metabase

En Metabase, cuando te pida conectar base de datos:

- **Tipo de base de datos:** PostgreSQL
- **Nombre:** `MecanicCompany Production`
- **Host:** `host.docker.internal` (Windows/Mac) o `172.17.0.1` (Linux)
- **Puerto:** `5432`
- **Nombre de la base de datos:** `[tu nombre de BD]` (ejemplo: `mecaniccompany`)
- **Usuario:** `metabase_readonly`
- **Contraseña:** `[la que pusiste en el SQL]`

Click en **Conectar** y espera...

✅ Si aparece un check verde, ¡estás listo!

---

## 📊 PRIMEROS PASOS EN METABASE

### 1. Explorar Datos

- Click en **Explorar datos**
- Verás tus 5 tablas: `Admin`, `Mecanico`, `Solicitud`, `Mantenimiento`, `CodigoVerificacion`

### 2. Crear Tu Primera Pregunta

**Ejemplo: Total de Ingresos del Mes Actual**

1. Click en **Nueva** → **Pregunta**
2. Selecciona tabla: **Mantenimiento**
3. Click en **Resumir** (Summarize)
4. Selecciona: **Expresión personalizada**
5. Escribe:
   ```
   sum([costoManoObra]) + sum([costoRepuestos])
   ```
6. Click en **Filtrar** (Filter)
7. Selecciona campo: **createdAt**
8. Tipo: **Relativo**
9. Selecciona: **Mes actual**
10. Click en **Visualizar**

¡Ya tienes tu primer KPI! 🎉

**Guardar:**
- Click en **Guardar**
- Nombre: `KPI - Ingresos Mes Actual`

### 3. Crear Tu Primera Gráfica

**Ejemplo: Ingresos por Mes**

1. **Nueva** → **Pregunta**
2. Tabla: **Mantenimiento**
3. Resumir: `sum([costoManoObra]) + sum([costoRepuestos])`
4. **Agrupar por:** `createdAt` → **Por mes**
5. **Filtrar:** Últimos 12 meses
6. **Visualización:** Cambiar a **Línea**

**Configurar Drill Down:**
1. Click en **⚙️ Configuración de visualización**
2. Tab **Comportamiento de click**
3. Selecciona: **Ir a un destino personalizado**
4. Click en **Crear pregunta personalizada**
5. Cambia agrupación a **Por día**

Guardar como: `Ingresos Mensuales (con Drill Down)`

---

## 🎨 CREAR TU PRIMER DASHBOARD

1. **Nueva** → **Dashboard**
2. Nombre: `📊 Visión General - MecanicCompany`
3. Click en **Guardar**
4. Click en **Agregar una pregunta**
5. Busca y agrega: `KPI - Ingresos Mes Actual`
6. Ajusta el tamaño arrastrando las esquinas

**Agrega más:**
- Ingresos Mensuales (gráfica de línea)
- Otros KPIs que vayas creando

---

## 🔍 CONSULTAS SQL ÚTILES PARA EMPEZAR

### Top 5 Mecánicos por Ingresos

```sql
SELECT 
  m.nombres || ' ' || m.apellidos as mecanico,
  m.especialidad,
  COUNT(mant.id) as servicios_completados,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_generados
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos, m.especialidad
ORDER BY ingresos_generados DESC
LIMIT 5
```

### Total de Servicios por Estado

```sql
SELECT 
  estado,
  COUNT(*) as cantidad,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "Solicitud"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY estado
ORDER BY cantidad DESC
```

### Ticket Promedio por Mes

```sql
SELECT 
  TO_CHAR("createdAt", 'YYYY-MM') as mes,
  COUNT(*) as servicios,
  AVG("costoManoObra" + "costoRepuestos") as ticket_promedio
FROM "Mantenimiento"
GROUP BY mes
ORDER BY mes DESC
LIMIT 12
```

---

## 🛠️ COMANDOS ÚTILES

### Ver Estado de Metabase
```powershell
docker-compose ps
```

### Ver Logs (si hay problemas)
```powershell
docker-compose logs -f metabase
```

### Reiniciar Metabase
```powershell
docker-compose restart
```

### Detener Metabase
```powershell
docker-compose stop
```

### Iniciar Metabase (si lo detuviste)
```powershell
docker-compose start
```

### Eliminar Todo (CUIDADO: Borra datos)
```powershell
docker-compose down -v
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Cannot connect to PostgreSQL"

**Posibles causas:**
1. PostgreSQL no está corriendo → Inicia tu backend
2. Host incorrecto → Prueba cambiar a:
   - `localhost`
   - `host.docker.internal`
   - `172.17.0.1`
3. Credenciales incorrectas → Verifica usuario/contraseña

### ❌ Error: "Port 3001 already in use"

Otro servicio usa el puerto 3001.

**Solución:**
Edita `docker-compose.yml` y cambia:
```yaml
ports:
  - "3002:3000"  # Cambiar 3001 por 3002
```

Luego accede a: `http://localhost:3002`

### ❌ Metabase no carga (pantalla en blanco)

Espera 1-2 minutos más. Verifica logs:
```powershell
docker-compose logs metabase
```

---

## 📚 SIGUIENTES PASOS

1. ✅ Lee el documento completo: `PLAN_DASHBOARD_BI.md`
2. ✅ Revisa el modelo de datos: `MODELO_ESTRELLA_MECANICCOMPANY.html`
3. ✅ Implementa los 4 dashboards principales (plan detallado en el PDF)
4. ✅ Configura usuarios y permisos
5. ✅ Programa backups semanales

---

## 🎓 RECURSOS

- **Documentación Metabase:** https://www.metabase.com/docs/latest/
- **Tutoriales en español:** https://www.metabase.com/learn/
- **Comunidad:** https://discourse.metabase.com/

---

**¡Listo para empezar! 🚀**

Si tienes dudas, consulta el plan completo en `PLAN_DASHBOARD_BI.md`
