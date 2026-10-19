# 🔧 DASHBOARD BI - MECANICCOMPANY

## 📋 RESUMEN

Dashboard profesional de Business Intelligence para analizar operaciones, finanzas, productividad y clientes de MecanicCompany.

- **Tecnología:** Metabase + Docker + PostgreSQL
- **Puerto:** http://localhost:3001
- **Tiempo de instalación:** 15 minutos
- **Costo:** $0 (open source)

---

## 🚀 INICIO RÁPIDO

### **1. Abrir Docker Desktop** 
- Busca "Docker Desktop" en Windows
- Abre la aplicación
- Espera a que esté corriendo (ícono ballena azul)

### **2. Instalar Metabase**
```powershell
docker-compose up -d
```

### **3. Acceder**
- Abre: http://localhost:3001
- Configurar usuario admin
- Conectar a PostgreSQL

---

## 📂 ARCHIVOS DEL PROYECTO

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.yml` | Configuración de Docker |
| `iniciar-metabase.ps1` | Script de instalación automática |
| `DISEÑO_DASHBOARD_BI.md` | Guía de diseño visual profesional |
| `IMPLEMENTACION_PASO_A_PASO.md` | Tutorial detallado |
| `consultas-sql-metabase.sql` | 20+ queries SQL listas |
| `crear-usuario-readonly.sql` | Script de seguridad PostgreSQL |
| `PLAN_DASHBOARD_BI.md` | Plan completo del proyecto |

---

## 📊 DASHBOARDS INCLUIDOS

### 1. 📈 Visión General
- KPIs: Ingresos, servicios, ticket promedio, conversión
- Gráfico de ingresos por mes (con drill down)
- Top 5 mecánicos
- Distribución de tipos de servicio

### 2. 👷 Productividad de Mecánicos
- Ranking de mecánicos
- Servicios por mecánico por mes
- Scatter plot de eficiencia
- Heatmap de disponibilidad

### 3. 💰 Análisis Financiero
- Márgenes (mano de obra vs repuestos)
- Crecimiento mensual
- Embudo de conversión
- Ingresos por tipo de servicio

### 4. 🚗 Clientes y Vehículos
- Top 10 marcas atendidas
- Modelos más frecuentes
- Clientes recurrentes
- Demanda por día de semana

---

## 🎨 DISEÑO PROFESIONAL

**Paleta de colores:**
- 🔵 Azul Mecánico: `#1E3A8A` (principal)
- ⚙️ Gris Metal: `#475569` (secundario)
- 🟢 Verde Activo: `#16A34A` (éxito)
- 🟡 Amarillo Precaución: `#F59E0B` (advertencia)
- 🔴 Rojo Crítico: `#DC2626` (peligro)

**Tipografía:** Inter, Segoe UI, Roboto

**Iconografía:** Font Awesome 6 (mecánica/taller)

---

## 🔧 COMANDOS ÚTILES

```powershell
# Ver estado
docker ps

# Ver logs
docker logs metabase-mecaniccompany -f

# Detener
docker-compose stop

# Iniciar
docker-compose start

# Reiniciar
docker-compose restart

# Eliminar (BORRA DATOS)
docker-compose down -v
```

---

## 📚 DOCUMENTACIÓN

- **Guía Rápida:** [GUIA_INICIO_RAPIDO_BI.md](GUIA_INICIO_RAPIDO_BI.md)
- **Implementación:** [IMPLEMENTACION_PASO_A_PASO.md](IMPLEMENTACION_PASO_A_PASO.md)
- **Diseño:** [DISEÑO_DASHBOARD_BI.md](DISEÑO_DASHBOARD_BI.md)
- **Plan Completo:** [PLAN_DASHBOARD_BI.md](PLAN_DASHBOARD_BI.md)

---

## 🔐 SEGURIDAD

- ✅ Usuario PostgreSQL de solo lectura
- ✅ Autenticación obligatoria
- ✅ Sesiones con timeout
- ✅ Datos sensibles ocultos

---

## 📞 SOPORTE

**Problema: Docker no está corriendo**
- Solución: Abre Docker Desktop y espera a que inicie

**Problema: Puerto 3001 en uso**
- Solución: Cambia puerto en `docker-compose.yml` (3001 → 3002)

**Problema: No conecta a PostgreSQL**
- Verifica: `host.docker.internal` (Windows/Mac) o `172.17.0.1` (Linux)

---

## ✅ STATUS

- [x] Docker instalado (v28.5.1)
- [ ] Docker corriendo → **Abre Docker Desktop**
- [ ] Metabase desplegado
- [ ] Usuario readonly creado
- [ ] Metabase conectado a PostgreSQL
- [ ] Dashboards creados

---

**🎯 Siguiente Acción:** Abre Docker Desktop, luego ejecuta `docker-compose up -d`
