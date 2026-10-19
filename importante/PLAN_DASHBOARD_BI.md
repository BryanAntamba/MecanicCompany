# PLAN DE IMPLEMENTACIÓN - DASHBOARD BI MECANICCOMPANY

## 📋 RESUMEN EJECUTIVO

### Objetivo General
Desarrollar un dashboard web de Business Intelligence (BI) independiente para analizar el desempeño operacional, financiero y de recursos humanos de MecanicCompany, permitiendo la toma de decisiones basada en datos mediante análisis multidimensional con capacidades de Drill Down y Roll Up.

### Alcance del Proyecto
- **Sistema:** Dashboard web separado de la aplicación móvil
- **Usuarios:** Administradores y gerentes (no clientes ni mecánicos)
- **Acceso:** Interfaz web en navegador (puerto 3001)
- **Integración:** Conexión directa a base de datos PostgreSQL existente
- **Análisis:** Datos históricos de mantenimientos, solicitudes, mecánicos y clientes

---

## 🎯 JUSTIFICACIÓN DEL PROYECTO

### Necesidades del Negocio
1. **Visibilidad Financiera:** Conocer ingresos reales, márgenes y tendencias de crecimiento
2. **Optimización de Recursos:** Identificar mecánicos más productivos y detectar cuellos de botella
3. **Análisis de Clientes:** Entender patrones de recurrencia y tipos de servicios más demandados
4. **Toma de Decisiones:** Basar estrategias en datos reales, no intuiciones

### ¿Por qué NO integrar en la app móvil?
- ❌ La app móvil (React Native) está diseñada para operaciones diarias (solicitudes, asignaciones)
- ❌ Dashboards complejos requieren pantallas grandes (PC/laptop)
- ❌ Análisis detallados no son necesarios para mecánicos o clientes
- ✅ Separación de responsabilidades: Operación (app móvil) vs Análisis (dashboard web)

---

## 🏗️ ARQUITECTURA DE LA SOLUCIÓN

### Stack Tecnológico Propuesto

#### **1. Metabase (Herramienta de BI)**
- **Tipo:** Software open source de Business Intelligence
- **Licencia:** AGPL (gratuita para uso interno)
- **Versión:** Latest stable (Community Edition)
- **Lenguaje:** Clojure + Java (no requiere conocerlo, es plug-and-play)
- **Base de datos interna:** H2 (para configuración de Metabase)

**¿Por qué Metabase?**
| Criterio | Justificación |
|----------|---------------|
| **Costo** | 100% gratuito vs Power BI ($10/usuario/mes) |
| **Tiempo de implementación** | 2-4 horas vs 20+ horas programando desde cero |
| **Mantenimiento** | Actualización con un comando vs mantener código propio |
| **Curva de aprendizaje** | Interfaz visual, sin código vs aprender librerías de gráficos |
| **Drill Down/Roll Up** | Funcionalidad nativa vs programar desde cero |
| **Exportación** | PDF, Excel, PNG incluidos vs implementar manualmente |
| **Seguridad** | Sistema de permisos robusto vs construir autenticación propia |

#### **2. Docker (Contenedorización)**
- **Versión:** Docker Desktop para Windows
- **Imagen:** `metabase/metabase:latest`

**¿Por qué Docker?**

**Problema sin Docker:**
```
1. Instalar Java JDK (500MB)
2. Instalar Clojure
3. Configurar variables de entorno
4. Descargar Metabase JAR (200MB)
5. Ejecutar java -jar metabase.jar
6. Configurar base de datos H2
7. Resolver conflictos de puertos
Tiempo: 2-3 horas + posibles errores
```

**Solución con Docker:**
```bash
docker run -d -p 3001:3000 --name metabase metabase/metabase
Tiempo: 2 minutos
```

**Ventajas de Docker:**
- ✅ **Portabilidad:** Funciona igual en Windows, Mac, Linux
- ✅ **Aislamiento:** No contamina tu sistema con dependencias
- ✅ **Reproducibilidad:** Mismo ambiente en desarrollo y producción
- ✅ **Facilidad:** Un solo comando para instalar y ejecutar
- ✅ **Limpieza:** Desinstalar es solo `docker rm metabase`
- ✅ **Backups:** Fácil hacer respaldos del contenedor y sus datos

**Concepto de Docker:**
```
┌─────────────────────────────────────┐
│  TU COMPUTADORA (Windows)           │
│  ┌───────────────────────────────┐  │
│  │  DOCKER                       │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ CONTENEDOR METABASE     │  │  │
│  │  │ - Ubuntu Linux          │  │  │
│  │  │ - Java                  │  │  │
│  │  │ - Metabase App          │  │  │
│  │  │ Puerto: 3001            │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Es como una máquina virtual ligera que contiene TODO lo necesario para Metabase.

#### **3. PostgreSQL (Base de Datos Existente)**
- **Versión:** La que ya tienes en tu proyecto
- **Rol:** Fuente de datos (no se modifica, solo lectura)
- **Conexión:** Metabase se conecta vía TCP/IP

#### **4. Modelo de Datos: Star Schema**
- **Tabla de Hechos:** Mantenimientos (métricas cuantitativas)
- **Dimensiones:** Tiempo, Cliente, Vehículo, Estado, TipoServicio, Mecánico

---

## 📊 COMPONENTES DEL DASHBOARD

### Dashboard 1: VISIÓN GENERAL OPERACIONAL

**Objetivo:** Vista rápida del estado actual del negocio

**KPIs Principales:**
1. **Total Mantenimientos del Mes**
   - Métrica: COUNT(mantenimientos) WHERE MONTH(createdAt) = CURRENT_MONTH
   - Comparación: vs mes anterior (%)

2. **Ingresos Totales del Mes**
   - Métrica: SUM(costoManoObra + costoRepuestos)
   - Formato: $XXX,XXX.XX
   - Indicador: Verde si >meta, Rojo si <meta

3. **Ticket Promedio**
   - Métrica: Ingresos Totales / Total Mantenimientos
   - Benchmark: Contra promedio histórico

4. **Tasa de Conversión**
   - Métrica: (Solicitudes Completadas / Total Solicitudes) * 100
   - Rango objetivo: 70-85%

**Gráficos:**

**A) Ingresos por Mes (Últimos 12 meses) - CON DRILL DOWN**
- Tipo: Línea + Área
- Eje X: Meses (Ene 2025 - Jun 2026)
- Eje Y: Ingresos ($)
- **Drill Down:** Click en un mes → Ver ingresos por día de ese mes
- **Drill Down 2:** Click en un día → Ver servicios individuales

**B) Top 5 Mecánicos por Ingresos**
- Tipo: Barras horizontales
- Ordenado: Mayor a menor
- Colores: Degradado según posición

**C) Distribución de Tipos de Servicio**
- Tipo: Dona (Pie chart)
- Categorías: Mantenimiento preventivo, Reparación motor, Electricidad, etc.
- Tooltip: Cantidad + Porcentaje

---

### Dashboard 2: PRODUCTIVIDAD DE MECÁNICOS

**Objetivo:** Evaluar desempeño individual y eficiencia del equipo

**Tabla de Ranking:**
| Mecánico | Servicios Completados | Ingresos Generados | Tiempo Promedio | Eficiencia |
|----------|----------------------|-------------------|----------------|------------|
| Juan Pérez | 45 | $12,500 | 2.3 hrs | 95% |
| María López | 38 | $10,200 | 2.8 hrs | 88% |

**Gráficos:**

**A) Servicios por Mecánico por Mes - CON DRILL DOWN**
- Tipo: Barras apiladas
- Eje X: Mecánicos
- Eje Y: Cantidad de servicios
- Colores: Por tipo de servicio
- **Drill Down:** Click en un mecánico → Ver sus servicios por día

**B) Tiempo de Servicio vs Ingresos (Scatter Plot)**
- Objetivo: Detectar mecánicos eficientes (alta facturación, bajo tiempo)
- Eje X: Tiempo promedio (horas)
- Eje Y: Ingresos totales ($)
- Puntos: Cada mecánico
- Cuadrantes: Alta eficiencia, Baja eficiencia

**C) Heatmap de Disponibilidad**
- Filas: Mecánicos
- Columnas: Días de la semana
- Color: Intensidad = Cantidad de servicios
- Objetivo: Identificar patrones de ocupación

---

### Dashboard 3: ANÁLISIS FINANCIERO

**Objetivo:** Entender márgenes, costos y proyecciones

**Métricas Financieras:**

1. **Margen de Contribución**
   ```
   Margen Mano de Obra = (Ingresos Mano Obra / Ingresos Totales) * 100
   Margen Repuestos = (Ingresos Repuestos / Ingresos Totales) * 100
   ```

2. **Crecimiento Mensual (MoM - Month over Month)**
   ```
   % Crecimiento = ((Mes Actual - Mes Anterior) / Mes Anterior) * 100
   ```

3. **Proyección Próximo Mes**
   - Modelo: Promedio móvil de últimos 3 meses
   - Ajuste: +/- estacionalidad

**Gráficos:**

**A) Ingresos por Tipo de Servicio - CON DRILL DOWN**
- Tipo: Barras verticales
- Categorías: Mantenimiento, Reparación, Diagnóstico, etc.
- **Drill Down:** Click en tipo → Ver mecánicos que lo realizaron
- **Drill Down 2:** Click en mecánico → Ver servicios individuales

**B) Costo Mano de Obra vs Costo Repuestos (Dual Axis)**
- Tipo: Líneas duales
- Eje Y izq: Mano de obra ($)
- Eje Y der: Repuestos ($)
- Objetivo: Ver tendencias de costos

**C) Embudo de Conversión**
- Nivel 1: Solicitudes recibidas (100%)
- Nivel 2: Solicitudes asignadas (85%)
- Nivel 3: Mantenimientos completados (70%)
- Pérdida en cada nivel (%)

---

### Dashboard 4: ANÁLISIS DE CLIENTES Y VEHÍCULOS

**Objetivo:** Entender demanda y fidelización

**Análisis de Vehículos:**

**A) Top 10 Marcas Atendidas**
- Tipo: Barras horizontales
- Dato: Cantidad de servicios por marca
- Insight: Enfoque en especialización

**B) Modelos Más Frecuentes (Tabla)**
| Marca | Modelo | Año Promedio | Servicios | Último Servicio |
|-------|--------|--------------|-----------|----------------|
| Toyota | Corolla | 2018 | 23 | 2026-06-15 |

**Análisis de Clientes:**

**C) Clientes Recurrentes (Top 10)**
- Métricas: Nombre, Total servicios, Gasto acumulado, Último servicio
- Objetivo: Programa de fidelización

**D) Mapa de Calor: Frecuencia por Día de Semana**
- Filas: Hora del día (8am - 6pm)
- Columnas: Día de semana (Lun - Sab)
- Color: Cantidad de solicitudes
- Insight: Optimizar staffing

---

## 🔄 FUNCIONALIDADES DE DRILL DOWN Y ROLL UP

### Concepto

**ROLL UP (Agregación - De lo específico a lo general):**
```
Servicio Individual → Día → Semana → Mes → Trimestre → Año
```

**DRILL DOWN (Desagregación - De lo general a lo específico):**
```
Año → Trimestre → Mes → Semana → Día → Servicio Individual
```

### Jerarquías Implementadas

#### **1. Jerarquía Temporal**
```
Año (2026)
  └── Trimestre (Q2)
      └── Mes (Junio)
          └── Semana (Semana 26)
              └── Día (29 de junio)
                  └── Servicio (#12345)
```

**Consulta SQL para Metabase:**
```sql
SELECT 
  EXTRACT(YEAR FROM "createdAt") as año,
  EXTRACT(QUARTER FROM "createdAt") as trimestre,
  EXTRACT(MONTH FROM "createdAt") as mes,
  EXTRACT(WEEK FROM "createdAt") as semana,
  DATE("createdAt") as fecha,
  "id" as servicio_id,
  ("costoManoObra" + "costoRepuestos") as ingreso_total
FROM "Mantenimiento"
ORDER BY año, trimestre, mes, semana, fecha
```

#### **2. Jerarquía Geográfica (Cliente)**
```
País (Colombia)
  └── Región (Antioquia)
      └── Ciudad (Medellín)
          └── Cliente Individual (Juan Pérez)
```

#### **3. Jerarquía de Servicio**
```
Categoría General (Mantenimiento)
  └── Tipo Específico (Mantenimiento Preventivo)
      └── Subtipo (Cambio de Aceite)
          └── Servicio Individual (#12345)
```

#### **4. Jerarquía Organizacional**
```
Todos los Mecánicos
  └── Especialidad (Electricidad)
      └── Mecánico Individual (Carlos Gómez)
          └── Servicios realizados
```

### Ejemplo Práctico de Uso

**Escenario:** Gerente quiere saber por qué los ingresos bajaron en mayo 2026

1. **Vista inicial (Roll Up - Anual):**
   - Gráfico muestra ingresos por mes (Ene - Jun 2026)
   - Mayo tiene $45,000 vs $55,000 promedio

2. **Click en Mayo (Drill Down - Mensual → Diario):**
   - Se despliega gráfico de ingresos por día
   - Ve que días 15-20 de mayo tuvieron muy pocos servicios

3. **Click en 18 de mayo (Drill Down - Diario → Individual):**
   - Lista de servicios ese día (solo 2 servicios)
   - Detecta: Feriado local no considerado

4. **Acción:** Ajustar proyecciones considerando calendario de feriados

---

## 🛠️ PLAN DE IMPLEMENTACIÓN DETALLADO

### FASE 1: PREPARACIÓN DEL AMBIENTE (30 minutos)

#### Paso 1.1: Instalar Docker Desktop
1. Descargar de https://www.docker.com/products/docker-desktop
2. Instalar (requiere reinicio)
3. Verificar instalación:
   ```powershell
   docker --version
   # Debe mostrar: Docker version 24.x.x
   ```

#### Paso 1.2: Verificar Acceso a PostgreSQL
1. Confirmar credenciales de base de datos:
   - Host: `localhost` (o IP del servidor)
   - Puerto: `5432` (por defecto)
   - Database: Nombre de tu base de datos
   - Usuario: Tu usuario PostgreSQL
   - Contraseña: Tu contraseña

2. Probar conexión:
   ```powershell
   # Desde terminal en backend/
   npx prisma db pull
   # Si funciona, la conexión es correcta
   ```

#### Paso 1.3: Documentar Estructura de Datos
- Crear diagrama ER de las 5 tablas:
  - Admin
  - Mecanico
  - Solicitud
  - Mantenimiento
  - CodigoVerificacion

---

### FASE 2: INSTALACIÓN DE METABASE (15 minutos)

#### Paso 2.1: Descargar e Iniciar Metabase
```powershell
# Ejecutar en PowerShell
docker run -d `
  -p 3001:3000 `
  --name metabase `
  -v metabase-data:/metabase-data `
  -e MB_DB_FILE=/metabase-data/metabase.db `
  metabase/metabase
```

**Explicación del comando:**
- `-d`: Ejecutar en segundo plano (daemon)
- `-p 3001:3000`: Mapear puerto 3000 del contenedor → 3001 de tu PC
- `--name metabase`: Nombre del contenedor
- `-v metabase-data:/metabase-data`: Volumen persistente (guardar configuración)
- `-e MB_DB_FILE=...`: Archivo de base de datos interna de Metabase

#### Paso 2.2: Primer Acceso
1. Esperar 2 minutos (Metabase se inicializa)
2. Abrir navegador: `http://localhost:3001`
3. Configuración inicial:
   - Idioma: Español
   - Crear cuenta admin:
     - Email: admin@mecanic.com
     - Nombre: Administrador
     - Contraseña: [tu contraseña segura]

---

### FASE 3: CONEXIÓN A BASE DE DATOS (20 minutos)

#### Paso 3.1: Agregar Base de Datos en Metabase
1. Click en engranaje (⚙️) → "Admin Settings"
2. Click en "Databases" → "Add database"
3. Configurar:
   - **Database type:** PostgreSQL
   - **Name:** MecanicCompany_Production
   - **Host:** host.docker.internal (Windows) o localhost (si no funciona)
   - **Port:** 5432
   - **Database name:** [nombre de tu BD]
   - **Username:** [tu usuario]
   - **Password:** [tu contraseña]
   - **Additional JDBC options:** (dejar vacío)

4. Click "Save"
5. Verificar conexión (debe aparecer check verde ✓)

#### Paso 3.2: Sincronizar Esquema
- Metabase detectará automáticamente las 5 tablas
- Esperar 5 minutos para que analice relaciones y tipos de datos

---

### FASE 4: CREACIÓN DE VISUALIZACIONES (2 horas)

#### Dashboard 1: Visión General (30 minutos)

**KPI 1: Total Mantenimientos del Mes**
1. "New" → "Question" → "Simple question"
2. Seleccionar tabla: Mantenimiento
3. Summarize: Count
4. Filter: createdAt is in the current month
5. Display: Number
6. Guardar como: "KPI - Total Mantenimientos Mes Actual"

**KPI 2: Ingresos Totales del Mes**
1. Nueva pregunta → Mantenimiento
2. Summarize: Custom expression
   ```
   sum([costoManoObra]) + sum([costoRepuestos])
   ```
3. Filter: createdAt is in the current month
4. Display: Number → Format as currency ($)
5. Guardar como: "KPI - Ingresos Mes Actual"

**Gráfico: Ingresos por Mes (con Drill Down)**
1. Nueva pregunta → Mantenimiento
2. Summarize: Custom expression (ingresos totales)
3. Group by: createdAt → by Month
4. Filter: createdAt is in the previous 12 months
5. Display: Line chart
6. **Configurar Drill Down:**
   - Click en "Visualization settings"
   - "Click behavior" → "Go to a custom destination"
   - Create new question → Group by Day (when Month is clicked)
7. Guardar como: "Ingresos Mensuales (Drill Down Habilitado)"

#### Dashboard 2: Productividad (30 minutos)

**Tabla: Ranking Mecánicos**
1. Nueva pregunta → Usar SQL personalizado:
```sql
SELECT 
  m.id,
  m.nombres || ' ' || m.apellidos as mecanico,
  m.especialidad,
  COUNT(mant.id) as servicios_completados,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_generados,
  AVG(EXTRACT(EPOCH FROM (mant."updatedAt" - mant."createdAt"))/3600) as tiempo_promedio_hrs
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos, m.especialidad
ORDER BY ingresos_generados DESC
LIMIT 10
```
2. Display: Table
3. Format: Ingresos como moneda, Tiempo con 1 decimal
4. Guardar como: "Ranking Top 10 Mecánicos"

#### Dashboard 3: Análisis Financiero (30 minutos)

**Gráfico: Embudo de Conversión**
1. Crear 3 preguntas separadas:
   - A) Total Solicitudes mes actual
   - B) Solicitudes Asignadas (estado != "Pendiente")
   - C) Mantenimientos Completados
2. Combinar en un dashboard
3. Usar visualización "Funnel" (si está disponible) o "Bar chart" horizontal

#### Dashboard 4: Clientes y Vehículos (30 minutos)

**Gráfico: Top Marcas de Vehículos**
1. Nueva pregunta → Solicitud
2. Summarize: Count
3. Group by: marcaVehiculo
4. Filter: Últimos 6 meses
5. Display: Horizontal bar chart
6. Limit: Top 10
7. Order by: Count descending

---

### FASE 5: CREACIÓN DE DASHBOARDS (1 hora)

#### Paso 5.1: Crear Dashboard "Visión General"
1. Click en "+" → "New" → "Dashboard"
2. Nombre: "📊 Visión General - MecanicCompany"
3. Descripción: "Vista ejecutiva del estado operacional y financiero"
4. Agregar las preguntas guardadas:
   - Arrastrar KPIs arriba (4 tarjetas en fila)
   - Gráfico de ingresos mensuales (ancho completo)
   - Top mecánicos e ingresos (mitad y mitad)
   - Distribución de servicios (1/3 del ancho)

#### Paso 5.2: Configurar Filtros Globales
1. Click en "Add a Filter"
2. Agregar filtro: "Rango de Fechas"
3. Conectar a todas las visualizaciones
4. Default: "Últimos 30 días"

#### Paso 5.3: Estilo y Diseño
1. Cambiar tema: "Night Mode" (opcional)
2. Ajustar tamaños de tarjetas
3. Agregar texto descriptivo entre secciones

#### Paso 5.4: Compartir Dashboard
1. Click en "Sharing" (ícono compartir)
2. Crear link público (opcional)
3. O configurar usuarios con acceso

---

## 📈 MÉTRICAS Y KPIs DEFINIDOS

### KPIs Operacionales

| KPI | Fórmula | Meta | Frecuencia |
|-----|---------|------|------------|
| Total Mantenimientos | COUNT(Mantenimiento) | >50/mes | Diaria |
| Tasa de Conversión | (Mantenimientos / Solicitudes) * 100 | >70% | Semanal |
| Tiempo Promedio de Servicio | AVG(fechaFin - fechaInicio) | <3 horas | Diaria |
| Servicios por Mecánico | COUNT(Mantenimiento) / COUNT(Mecanico activo) | >12/mes | Mensual |

### KPIs Financieros

| KPI | Fórmula | Meta | Frecuencia |
|-----|---------|------|------------|
| Ingresos Mensuales | SUM(costoManoObra + costoRepuestos) | >$50,000 | Diaria |
| Ticket Promedio | Ingresos / Total Mantenimientos | >$1,000 | Semanal |
| Margen Mano de Obra | (SUM(costoManoObra) / Ingresos) * 100 | 60-70% | Mensual |
| Margen Repuestos | (SUM(costoRepuestos) / Ingresos) * 100 | 30-40% | Mensual |
| Crecimiento MoM | ((Mes Actual - Mes Anterior) / Mes Anterior) * 100 | >5% | Mensual |

### KPIs de Productividad

| KPI | Fórmula | Meta | Frecuencia |
|-----|---------|------|------------|
| Eficiencia por Mecánico | Ingresos / Horas trabajadas | >$500/hr | Semanal |
| Tasa de Ocupación | (Horas en servicios / Horas disponibles) * 100 | 75-85% | Diaria |
| Servicios por Día | COUNT(Mantenimiento) / Días laborales | >3/día/mecánico | Semanal |

---

## 🔒 SEGURIDAD Y PERMISOS

### Usuarios de Metabase

#### Rol 1: Administrador
- **Acceso:** Total
- **Puede:** Ver, crear, editar, eliminar dashboards y preguntas
- **Usuario:** admin@mecanic.com

#### Rol 2: Gerente
- **Acceso:** Solo lectura
- **Puede:** Ver dashboards, filtrar datos, exportar reportes
- **No puede:** Modificar preguntas ni configuración

#### Rol 3: Analista
- **Acceso:** Lectura + creación
- **Puede:** Ver, crear nuevas preguntas, clonar dashboards
- **No puede:** Modificar dashboards principales ni configuración

### Seguridad de Datos

1. **Conexión a Base de Datos:**
   - Usuario PostgreSQL con permisos SOLO de lectura (SELECT)
   - Sin permisos de INSERT, UPDATE, DELETE
   - Crear usuario específico:
   ```sql
   CREATE USER metabase_readonly WITH PASSWORD 'secure_password';
   GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;
   GRANT USAGE ON SCHEMA public TO metabase_readonly;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;
   ```

2. **Acceso Web:**
   - HTTPS (si se despliega en producción)
   - Autenticación obligatoria
   - Sesiones con timeout (1 hora de inactividad)

3. **Datos Sensibles:**
   - Ocultar campos sensibles (contraseñas, tokens)
   - Metabase no muestra datos de CodigoVerificacion (no es necesario para BI)

---

## 🚀 DESPLIEGUE Y MANTENIMIENTO

### Ambiente de Desarrollo (Local)
```powershell
# Iniciar Metabase
docker start metabase

# Ver logs
docker logs -f metabase

# Detener Metabase
docker stop metabase
```

### Ambiente de Producción (Opcional - Futuro)

**Opción A: Servidor en la Nube (AWS, DigitalOcean)**
```bash
# En servidor Ubuntu
docker run -d \
  -p 80:3000 \
  --name metabase \
  -v /opt/metabase-data:/metabase-data \
  -e MB_DB_FILE=/metabase-data/metabase.db \
  --restart always \
  metabase/metabase
```

**Opción B: Docker Compose (Recomendado para Producción)**
```yaml
version: '3.8'
services:
  metabase:
    image: metabase/metabase:latest
    container_name: metabase
    ports:
      - "3001:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabase
      MB_DB_PORT: 5432
      MB_DB_USER: metabase
      MB_DB_PASS: ${MB_DB_PASSWORD}
      MB_DB_HOST: postgres
    volumes:
      - metabase-data:/metabase-data
    depends_on:
      - postgres-metabase
    restart: always

  postgres-metabase:
    image: postgres:14
    container_name: postgres-metabase
    environment:
      POSTGRES_DB: metabase
      POSTGRES_USER: metabase
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: always

volumes:
  metabase-data:
  postgres-data:
```

### Backups

**Backup de Configuración de Metabase:**
```powershell
# Backup del volumen Docker
docker run --rm \
  -v metabase-data:/data \
  -v ${PWD}:/backup \
  ubuntu tar czf /backup/metabase-backup-$(date +%Y%m%d).tar.gz /data
```

**Backup de Base de Datos PostgreSQL (datos reales):**
```powershell
# Desde backend/
pg_dump -U tu_usuario -h localhost -d mecaniccompany > backup_$(date +%Y%m%d).sql
```

### Mantenimiento

**Semanal:**
- Verificar logs de Metabase: `docker logs metabase | tail -100`
- Revisar uso de disco: `docker system df`

**Mensual:**
- Actualizar Metabase:
  ```powershell
  docker pull metabase/metabase:latest
  docker stop metabase
  docker rm metabase
  # Volver a correr con imagen actualizada
  ```
- Hacer backup de configuración

---

## 📊 ENTREGABLES DEL PROYECTO

### Documentación
1. ✅ Manual de Usuario de Metabase
2. ✅ Guía de Creación de Dashboards
3. ✅ Catálogo de KPIs y Métricas
4. ✅ Diagrama de Arquitectura BI
5. ✅ Modelo Estrella (Star Schema)

### Archivos Técnicos
1. ✅ Script de instalación Docker
2. ✅ docker-compose.yml (producción)
3. ✅ Queries SQL personalizadas
4. ✅ Script de usuario readonly PostgreSQL
5. ✅ Script de backup automatizado

### Dashboards Implementados
1. ✅ Visión General Operacional
2. ✅ Productividad de Mecánicos
3. ✅ Análisis Financiero
4. ✅ Análisis de Clientes y Vehículos

---

## ⏱️ CRONOGRAMA ESTIMADO

| Fase | Duración | Dependencias |
|------|----------|--------------|
| Instalación Docker | 30 min | - |
| Instalación Metabase | 15 min | Docker |
| Conexión BD | 20 min | Metabase, Credenciales |
| Creación Visualizaciones | 2 hrs | Conexión BD |
| Ensamblaje Dashboards | 1 hr | Visualizaciones |
| Pruebas y Ajustes | 1 hr | Dashboards |
| **TOTAL** | **5 horas** | - |

---

## 🎓 BENEFICIOS DEL PROYECTO

### Cuantitativos
- ⏱️ Reducción de 80% en tiempo de generación de reportes (de 2 horas manuales a 10 minutos)
- 📊 Visibilidad en tiempo real de 15+ KPIs críticos
- 💰 Ahorro de ~$120/mes vs Power BI (si escala a 12 usuarios)
- 🎯 Identificación de top 20% de mecánicos que generan 80% de ingresos

### Cualitativos
- ✅ Toma de decisiones basada en datos, no intuición
- ✅ Detección temprana de problemas operacionales
- ✅ Identificación de oportunidades de mejora
- ✅ Cultura organizacional orientada a métricas
- ✅ Capacidad de análisis histórico y tendencias

---

## OPCIÓN 1: METABASE (SELECCIONADO - JUSTIFICACIÓN DETALLADA ARRIBA)

### ¿Por qué Metabase?
- ✅ Open source y gratuito
- ✅ Se conecta directamente a PostgreSQL
- ✅ No requiere código, interfaz visual
- ✅ Dashboards interactivos con Drill Down/Roll Up
- ✅ Exportación a PDF/Excel
- ✅ Se puede desplegar en Docker

### Pasos de Implementación:

#### 1. Instalar Metabase con Docker
```bash
# En la raíz del proyecto
docker run -d -p 3001:3000 --name metabase metabase/metabase
```

#### 2. Configurar conexión a PostgreSQL
- Abrir http://localhost:3001
- Conectar a tu base de datos PostgreSQL
- Host: localhost
- Puerto: 5432 (o el que uses)
- Database: tu_database_name
- Usuario y contraseña de PostgreSQL

#### 3. Crear las siguientes visualizaciones:

##### 📊 **Dashboard 1: VISIÓN GENERAL**
- **KPI Cards:**
  - Total de mantenimientos del mes
  - Ingresos totales del mes
  - Ticket promedio
  - Tasa de conversión (Solicitudes → Mantenimientos)

- **Gráficos:**
  - Línea: Ingresos por mes (últimos 12 meses) - **Con Drill Down a días**
  - Barras: Top 5 mecánicos por ingresos generados
  - Pie: Distribución de servicios (tipos más solicitados)

##### 👷 **Dashboard 2: PRODUCTIVIDAD DE MECÁNICOS**
- **Tabla:** Ranking de mecánicos
  - Columnas: Nombre, Servicios completados, Ingresos generados, Tiempo promedio
  - Ordenado por ingresos descendente

- **Gráficos:**
  - Barras apiladas: Servicios por mecánico por mes
  - Scatter: Tiempo de servicio vs Ingresos (por mecánico)
  - Heatmap: Disponibilidad de mecánicos por día/hora

##### 💰 **Dashboard 3: ANÁLISIS FINANCIERO**
- **Métricas:**
  - Margen de contribución (Mano de obra vs Repuestos)
  - Crecimiento mensual de ingresos (%)
  - Proyección de ingresos próximo mes

- **Gráficos:**
  - Barras: Ingresos por tipo de servicio - **Con Drill Down a mecánicos**
  - Línea dual: Costo mano de obra vs Costo repuestos por mes
  - Embudo: Solicitudes → Asignadas → Completadas

##### 🚗 **Dashboard 4: ANÁLISIS DE CLIENTES Y VEHÍCULOS**
- **Top marcas atendidas** (barras)
- **Modelos más frecuentes** (tabla)
- **Clientes recurrentes** (tabla: nombre, # servicios, último servicio)
- **Mapa de calor:** Frecuencia de servicios por día de la semana

#### 4. Configurar Drill Down/Roll Up

**Ejemplo: Ingresos por Tiempo**
- Crear dimensión de tiempo: Año → Trimestre → Mes → Día
- En Metabase: Question → Custom Column
  ```sql
  -- Ejemplo de consulta para jerarquía temporal
  SELECT 
    EXTRACT(YEAR FROM "createdAt") as año,
    EXTRACT(QUARTER FROM "createdAt") as trimestre,
    EXTRACT(MONTH FROM "createdAt") as mes,
    DATE("createdAt") as fecha,
    SUM("costoManoObra" + "costoRepuestos") as ingresos_totales
  FROM mantenimientos
  GROUP BY 1,2,3,4
  ORDER BY 1,2,3,4
  ```

**En el dashboard:** Click en una barra → Ve el desglose del siguiente nivel

---

## 📝 CONCLUSIÓN Y PRÓXIMOS PASOS

### Decisión Técnica: METABASE

Después del análisis comparativo, se ha seleccionado **Metabase** como la solución de Business Intelligence para MecanicCompany por las siguientes razones:

#### Justificación Técnica
1. **Tiempo de Implementación:** 5 horas vs 20+ horas de desarrollo custom
2. **Costo:** $0 (open source) vs $120/mes/usuario (Power BI)
3. **Mantenibilidad:** Actualizaciones automáticas vs mantener código propio
4. **Funcionalidad:** Drill Down/Roll Up nativo incluido
5. **Escalabilidad:** Soporta múltiples usuarios sin costo adicional

#### Arquitectura Final
```
┌─────────────────────────────────────────┐
│  USUARIOS (Navegador Web)               │
│  → http://localhost:3001                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  METABASE (Docker Container)            │
│  - Interfaz BI                          │
│  - Queries SQL                          │
│  - Visualizaciones                      │
│  - Dashboards interactivos              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  POSTGRESQL (Base de Datos)             │
│  - Admin                                │
│  - Mecanico                             │
│  - Solicitud                            │
│  - Mantenimiento                        │
│  - CodigoVerificacion                   │
└─────────────────────────────────────────┘
```

### Roadmap de Implementación

**Semana 1:**
- ✅ Instalar Docker Desktop
- ✅ Desplegar Metabase en contenedor
- ✅ Conectar a base de datos PostgreSQL
- ✅ Crear usuario readonly para seguridad

**Semana 2:**
- ✅ Crear visualizaciones para Dashboard 1 (Visión General)
- ✅ Crear visualizaciones para Dashboard 2 (Productividad)
- ✅ Configurar jerarquías temporales para Drill Down

**Semana 3:**
- ✅ Crear visualizaciones para Dashboard 3 (Financiero)
- ✅ Crear visualizaciones para Dashboard 4 (Clientes)
- ✅ Configurar filtros globales

**Semana 4:**
- ✅ Pruebas de funcionalidad Drill Down/Roll Up
- ✅ Configurar permisos de usuarios
- ✅ Documentación de uso
- ✅ Capacitación a administradores

### Entregables para el Informe

**Documentos Escritos:**
1. ✅ Este plan de implementación completo
2. ✅ Diagrama de arquitectura BI (ARQUITECTURA_BI_MECANICCOMPANY.html)
3. ✅ Modelo Estrella (MODELO_ESTRELLA_MECANICCOMPANY.html)
4. ✅ Catálogo de KPIs y métricas
5. ✅ Manual de usuario Metabase

**Evidencias Técnicas (Futuro):**
1. Screenshots de dashboards implementados
2. Consultas SQL utilizadas
3. Logs de instalación Docker
4. Resultados de pruebas de Drill Down

### Comando Rápido de Inicio

```powershell
# Verificar Docker instalado
docker --version

# Instalar y ejecutar Metabase
docker run -d `
  -p 3001:3000 `
  --name metabase `
  -v metabase-data:/metabase-data `
  -e MB_DB_FILE=/metabase-data/metabase.db `
  --restart always `
  metabase/metabase

# Verificar que está corriendo
docker ps | Select-String metabase

# Abrir en navegador
Start-Process "http://localhost:3001"
```

### Soporte y Recursos

**Documentación Oficial:**
- Metabase: https://www.metabase.com/docs/latest/
- Docker: https://docs.docker.com/
- PostgreSQL: https://www.postgresql.org/docs/

**Comunidad:**
- Metabase Community: https://discourse.metabase.com/
- Stack Overflow: Tag [metabase]

---

**NOTA:** Este documento contiene la planificación completa. La implementación real será ejecutada en las próximas 4 semanas según el cronograma establecido.
