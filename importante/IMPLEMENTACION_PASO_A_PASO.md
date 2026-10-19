# 🚀 IMPLEMENTACIÓN PASO A PASO - DASHBOARD BI MECANICCOMPANY

## ⚡ INICIO RÁPIDO (15 minutos)

### **PASO 1: Verificar Requisitos** ✅

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
.\verificar-requisitos.ps1
```

Este script verifica:
- ✅ Docker Desktop instalado y corriendo
- ✅ Puerto 3001 disponible
- ✅ PostgreSQL funcionando
- ✅ Todos los archivos necesarios

---

### **PASO 2: Instalar Metabase** 🐳

Si todo está OK en el paso anterior, ejecuta:

```powershell
.\iniciar-metabase.ps1
```

**Qué hace este script:**
1. Descarga imagen de Metabase (~200MB, tarda 2-5 min)
2. Crea contenedor Docker
3. Inicia Metabase en puerto 3001
4. Espera 30 segundos para inicialización
5. Abre navegador automáticamente

**Salida esperada:**
```
=========================================
  METABASE - MECANICCOMPANY BI
=========================================

[1/5] Verificando Docker...
  ✓ Docker encontrado: Docker version 24.0.2

[2/5] Verificando instancia existente...
  (primera vez, no hay instancia)

[3/5] Descargando Metabase...
  latest: Pulling from metabase/metabase
  ✓ Imagen descargada

[4/5] Iniciando Metabase...
  ✓ Metabase iniciado correctamente

[5/5] Esperando inicialización...
  ⏳ Tiempo restante: 30 segundos

=========================================
  ✓ METABASE INSTALADO EXITOSAMENTE
=========================================

🌐 URL: http://localhost:3001
```

---

### **PASO 3: Configuración Inicial** ⚙️

El navegador se abrirá en `http://localhost:3001`. Sigue estos pasos:

#### **3.1 Seleccionar Idioma**
- Selecciona: **Español**
- Click: **Siguiente**

#### **3.2 Crear Cuenta Administrador**
```
Nombre completo:    Administrador MecanicCompany
Email:             admin@mecanic.com
Contraseña:        [tu contraseña segura - mínimo 8 caracteres]
Confirmar:         [repetir contraseña]
```

Click: **Siguiente**

#### **3.3 Información de la Empresa (Opcional)**
```
Nombre empresa:    MecanicCompany
Sector:           Automotriz / Servicios
```

Click: **Siguiente**

#### **3.4 Preferencias de Uso (Opcional)**
- Puedes saltarlo: **Omitir**

---

### **PASO 4: Crear Usuario de Solo Lectura en PostgreSQL** 🔒

**IMPORTANTE:** Por seguridad, Metabase debe conectarse con un usuario que SOLO pueda leer datos.

#### **Opción A: Usando pgAdmin (GUI)**

1. Abre pgAdmin
2. Conecta a tu servidor PostgreSQL
3. Click derecho en "Login/Group Roles" → **Create** → **Login/Group Role**
4. Pestaña **General:**
   - Name: `metabase_readonly`
5. Pestaña **Definition:**
   - Password: `[contraseña segura]`
6. Pestaña **Privileges:**
   - Can login: **YES**
   - Todos los demás: **NO**
7. **Save**

8. Ahora otorga permisos de lectura:
   - Click derecho en tu base de datos → **Query Tool**
   - Pega y ejecuta:

```sql
GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;
GRANT USAGE ON SCHEMA public TO metabase_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_readonly;
```

#### **Opción B: Usando Terminal/CMD**

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, pega el contenido de crear-usuario-readonly.sql
\i crear-usuario-readonly.sql

# O copia y pega directamente:
```

```sql
CREATE USER metabase_readonly WITH PASSWORD 'password_seguro_123';
GRANT CONNECT ON DATABASE mecaniccompany TO metabase_readonly;
GRANT USAGE ON SCHEMA public TO metabase_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_readonly;
```

#### **Verificar Usuario Creado:**

```sql
-- Listar usuarios
\du

-- Debe aparecer:
-- metabase_readonly | Cannot login | {}
```

---

### **PASO 5: Conectar Metabase a PostgreSQL** 🔌

Vuelve a Metabase (`http://localhost:3001`).

#### **5.1 Agregar Base de Datos**

Si no lo hizo automáticamente:
1. Click en **⚙️ Settings** (engranaje arriba derecha)
2. Click en **Admin settings**
3. Sección izquierda: **Databases**
4. Click: **Add database**

#### **5.2 Configurar Conexión**

```
Database type:         PostgreSQL
Name:                 MecanicCompany Production
Host:                 host.docker.internal    (Windows/Mac)
                      172.17.0.1              (Linux)
Port:                 5432
Database name:        [nombre de tu BD]  (ejemplo: mecaniccompany)
Database username:    metabase_readonly
Database password:    [la contraseña que pusiste]

Use a secure connection (SSL): No (si es local)
Additional JDBC options:       (dejar vacío)
```

**⚠️ IMPORTANTE - Host:**
- **Windows/Mac con Docker Desktop:** Usa `host.docker.internal`
- **Linux:** Usa `172.17.0.1` o `localhost`
- **PostgreSQL en otro servidor:** Usa la IP del servidor

#### **5.3 Probar Conexión**

Click: **Save**

**Debe aparecer:**
```
✓ Successfully saved!
Database added and sync initiated
```

#### **5.4 Esperar Sincronización**

Metabase escaneará las tablas (1-3 minutos):
- Ve a **Databases** → **MecanicCompany Production**
- Debe mostrar: ✓ **Sync completed**
- Tablas detectadas: 5
  - Admin
  - Mecanico
  - Solicitud
  - Mantenimiento
  - CodigoVerificacion

---

### **PASO 6: Crear Primera Visualización** 📊

#### **6.1 KPI Simple: Total Ingresos del Mes**

1. Click: **New** → **Question**
2. Selecciona: **Simple question**
3. **Pick your data:**
   - Database: `MecanicCompany Production`
   - Table: `Mantenimiento`
4. Click en **Summarize** (botón morado)
5. En "Summarize by": Click **Custom Expression**
6. Pega esto:
   ```
   sum([costoManoObra]) + sum([costoRepuestos])
   ```
7. Click en **Filter** (botón morado)
8. Campo: `createdAt`
9. Selecciona: **Relative dates**
10. Selecciona: **Current** → **Month**
11. Click: **Visualize**

**Resultado:**
```
┌─────────────────────┐
│   💰 $52,340        │
│                     │
│   Total Ingresos    │
│   Mes Actual        │
└─────────────────────┘
```

12. Click: **Save**
13. Nombre: `KPI - Ingresos Mes Actual`
14. Collection: `Our analytics` (por defecto)

¡Felicidades! 🎉 Creaste tu primer KPI.

---

### **PASO 7: Aplicar Diseño Profesional** 🎨

#### **7.1 Personalizar Apariencia**

1. **⚙️ Settings** → **Admin settings** → **Settings** → **Appearance**
2. **Application name:** `MecanicCompany BI`
3. **Application color:** `#1E3A8A` (azul mecánico)
4. **Logo:** (Opcional) Sube tu logo PNG
5. **Save changes**

#### **7.2 Configurar Formato de Moneda**

1. **Admin settings** → **Settings** → **Localization**
2. **Unit of currency:** `USD - US Dollar` (o tu moneda)
3. **Currency label style:** `$` (símbolo)
4. **Separator style:** `,` (comas para miles)

---

### **PASO 8: Crear Dashboard Completo** 📊

#### **8.1 Crear Dashboard**

1. Click: **New** → **Dashboard**
2. Nombre: `📊 Visión General - MecanicCompany`
3. Descripción: `Vista ejecutiva del estado operacional y financiero`
4. Click: **Create**

#### **8.2 Agregar KPIs**

1. Click: **Add a question** (o ícono +)
2. Busca: `KPI - Ingresos Mes Actual`
3. Click en la pregunta para agregarla
4. Ajusta tamaño arrastrando las esquinas
5. Posiciona en la parte superior izquierda

Repite para agregar más visualizaciones que vayas creando.

#### **8.3 Configurar Diseño**

```
┌─────────────────────────────────────────────┐
│  📊 Visión General - MecanicCompany         │
├─────────────────────────────────────────────┤
│ [KPI Ingresos] [KPI Servicios] [KPI Ticket]│
│                                             │
│ [Gráfico: Ingresos por Mes - Full Width]   │
│                                             │
│ [Top Mecánicos]      [Tipos de Servicio]   │
└─────────────────────────────────────────────┘
```

---

## 📈 SIGUIENTES PASOS

### **Semana 1: KPIs Básicos**
- [x] Total ingresos mes
- [ ] Total mantenimientos mes
- [ ] Ticket promedio
- [ ] Tasa de conversión

### **Semana 2: Gráficos Principales**
- [ ] Ingresos por mes (línea)
- [ ] Top 5 mecánicos (barras)
- [ ] Distribución servicios (dona)

### **Semana 3: Dashboard Productividad**
- [ ] Ranking mecánicos (tabla)
- [ ] Servicios por mecánico (barras apiladas)
- [ ] Heatmap disponibilidad

### **Semana 4: Dashboards Financiero y Clientes**
- [ ] Embudo conversión
- [ ] Márgenes (mano obra vs repuestos)
- [ ] Top marcas vehículos
- [ ] Clientes recurrentes

---

## 🔧 COMANDOS ÚTILES

### **Ver estado de Metabase:**
```powershell
docker ps
```

### **Ver logs:**
```powershell
docker logs metabase-mecaniccompany -f
```

### **Reiniciar Metabase:**
```powershell
docker restart metabase-mecaniccompany
```

### **Detener Metabase:**
```powershell
docker stop metabase-mecaniccompany
```

### **Iniciar Metabase (si está detenido):**
```powershell
docker start metabase-mecaniccompany
```

### **Backup de configuración:**
```powershell
docker run --rm -v metabase-mecaniccompany-data:/data -v ${PWD}:/backup ubuntu tar czf /backup/metabase-backup-$(Get-Date -Format 'yyyyMMdd').tar.gz /data
```

---

## 📚 RECURSOS

### **Documentación:**
- Metabase: https://www.metabase.com/docs/latest/
- PostgreSQL: https://www.postgresql.org/docs/
- Docker: https://docs.docker.com/

### **Archivos del Proyecto:**
- [docker-compose.yml](docker-compose.yml) - Configuración Docker
- [GUIA_INICIO_RAPIDO_BI.md](GUIA_INICIO_RAPIDO_BI.md) - Guía rápida
- [consultas-sql-metabase.sql](consultas-sql-metabase.sql) - 20+ queries listas
- [DISEÑO_DASHBOARD_BI.md](DISEÑO_DASHBOARD_BI.md) - Guía de diseño visual
- [PLAN_DASHBOARD_BI.md](PLAN_DASHBOARD_BI.md) - Plan completo

---

## 🆘 SOPORTE

### **Problemas Comunes:**

**❌ Puerto 3001 en uso:**
```powershell
# Ver qué proceso usa el puerto
Get-NetTCPConnection -LocalPort 3001

# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3000"  # Cambia 3001 por 3002
```

**❌ No puede conectar a PostgreSQL:**
1. Verifica que PostgreSQL está corriendo
2. Prueba diferentes hosts: `localhost`, `host.docker.internal`, `172.17.0.1`
3. Verifica credenciales del usuario `metabase_readonly`

**❌ Metabase no carga:**
1. Espera 2-3 minutos (primera carga es lenta)
2. Verifica logs: `docker logs metabase-mecaniccompany`
3. Reinicia: `docker restart metabase-mecaniccompany`

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Docker Desktop instalado y corriendo
- [ ] Script verificar-requisitos ejecutado con éxito
- [ ] Metabase instalado (puerto 3001)
- [ ] Cuenta admin creada
- [ ] Usuario readonly PostgreSQL creado
- [ ] Metabase conectado a PostgreSQL
- [ ] Sincronización completada (5 tablas)
- [ ] Primer KPI creado
- [ ] Diseño personalizado aplicado
- [ ] Dashboard creado

---

**🎯 META: Tener 4 dashboards completos en 4 semanas**

¡Éxito en tu implementación! 🚀
