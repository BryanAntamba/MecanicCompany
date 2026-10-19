# 📊 GUÍA PRÁCTICA: CONSULTAS Y EXPLICACIÓN DEL DASHBOARD

## 🎯 ÍNDICE
1. [Cómo Hacer Consultas Personalizadas](#consultas)
2. [Cómo Modificar Valores y Parámetros](#modificar)
3. [Cómo Explicar el Dashboard](#explicar)

---

## 🔍 1. CÓMO HACER CONSULTAS PERSONALIZADAS {#consultas}

### Método 1: Query Builder (Sin SQL - Visual)

**Paso a Paso:**

1. **Entrar a Metabase**
   - Abre tu navegador en `http://localhost:3000`
   - Inicia sesión

2. **Crear Nueva Pregunta**
   - Click en **"+ New"** (arriba derecha)
   - Selecciona **"Question"**

3. **Modo Visual (Recomendado para principiantes)**
   - Selecciona **"Simple question"**
   - Elige la tabla: `mantenimientos`, `solicitudes`, o `mecanicos`
   
4. **Construir tu consulta:**
   
   **Ejemplo 1: Ver servicios de un mes específico**
   ```
   Tabla: mantenimientos
   Filtros: 
     ✅ createdAt → is → Relative dates → Past 30 days
   Summarize: 
     ✅ Count of rows
   ```

   **Ejemplo 2: Ingresos por tipo de servicio**
   ```
   Tabla: solicitudes
   Filtros: ninguno
   Summarize:
     ✅ Sum of → costoManoObra + costoRepuestos
   Group by:
     ✅ tipoServicio
   ```

   **Ejemplo 3: Servicios por mecánico**
   ```
   Tabla: mecanicos
   Join: solicitudes (mecanicoId)
   Summarize:
     ✅ Count of rows
   Group by:
     ✅ nombres
     ✅ apellidos
   ```

---

### Método 2: SQL Nativo (Avanzado - Más Flexible)

**Paso a Paso:**

1. **Crear Nueva Pregunta SQL**
   - Click en **"+ New"** → **"Question"**
   - Selecciona **"Native query"** (SQL)

2. **Escribir tu consulta**

   **PLANTILLA BASE:**
   ```sql
   SELECT 
     columna1,
     columna2,
     COUNT(*) as total
   FROM "nombre_tabla"
   WHERE condicion
   GROUP BY columna1, columna2
   ORDER BY total DESC;
   ```

---

### 📋 EJEMPLOS DE CONSULTAS ÚTILES

#### 🔹 Consulta 1: Servicios por rango de fechas
```sql
SELECT 
  TO_CHAR("createdAt", 'DD/MM/YYYY') as "Fecha",
  COUNT(*) as "Total Servicios",
  SUM("costoManoObra" + "costoRepuestos") as "Ingresos"
FROM "mantenimientos"
WHERE "createdAt" BETWEEN '2026-01-01' AND '2026-06-30'
GROUP BY TO_CHAR("createdAt", 'DD/MM/YYYY')
ORDER BY "createdAt" DESC;
```

**Cómo modificar:**
- Cambia las fechas: `'2026-01-01'` y `'2026-06-30'`
- Cambia el formato de fecha: `'DD/MM/YYYY'` → `'YYYY-MM'` (para ver por mes)

---

#### 🔹 Consulta 2: Top mecánicos del mes
```sql
SELECT 
  m."nombres" || ' ' || m."apellidos" AS "Mecánico",
  m."especialidad",
  COUNT(man.id) AS "Servicios",
  SUM(man."costoManoObra" + man."costoRepuestos") AS "Ingresos"
FROM "mecanicos" m
LEFT JOIN "solicitudes" s ON s."mecanicoId" = m.id
LEFT JOIN "mantenimientos" man ON man."solicitudId" = s.id
WHERE man."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY m.id, m."nombres", m."apellidos", m."especialidad"
ORDER BY "Ingresos" DESC
LIMIT 10;
```

**Cómo modificar:**
- Cambia el número de resultados: `LIMIT 10` → `LIMIT 5`
- Cambia el orden: `ORDER BY "Ingresos"` → `ORDER BY "Servicios"`
- Cambia el período: `DATE_TRUNC('month', CURRENT_DATE)` → `CURRENT_DATE - INTERVAL '7 days'`

---

#### 🔹 Consulta 3: Servicios por tipo y estado
```sql
SELECT 
  s."tipoServicio",
  s."estado",
  COUNT(*) as "Cantidad",
  ROUND(AVG(m."costoManoObra" + m."costoRepuestos"), 2) as "Costo Promedio"
FROM "solicitudes" s
LEFT JOIN "mantenimientos" m ON m."solicitudId" = s.id
GROUP BY s."tipoServicio", s."estado"
ORDER BY "Cantidad" DESC;
```

**Cómo modificar:**
- Ver solo un tipo: Agrega `WHERE s."tipoServicio" = 'Mantenimiento Preventivo'`
- Ver solo completados: Agrega `WHERE s."estado" = 'Completado'`

---

#### 🔹 Consulta 4: Ingresos por día de la semana
```sql
SELECT 
  TO_CHAR("createdAt", 'Day') as "Día de la Semana",
  COUNT(*) as "Servicios",
  SUM("costoManoObra" + "costoRepuestos") as "Ingresos"
FROM "mantenimientos"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY TO_CHAR("createdAt", 'Day'), EXTRACT(DOW FROM "createdAt")
ORDER BY EXTRACT(DOW FROM "createdAt");
```

---

## ⚙️ 2. CÓMO MODIFICAR VALORES Y PARÁMETROS {#modificar}

### 🎛️ Agregar Filtros Interactivos (Parámetros)

Los **parámetros** permiten cambiar valores sin editar el SQL.

**Paso a Paso:**

1. **En tu consulta SQL**, agrega un placeholder:
   ```sql
   SELECT * 
   FROM "mantenimientos"
   WHERE "createdAt" >= {{fecha_inicio}}
   AND "createdAt" <= {{fecha_fin}}
   ```

2. **Configurar el parámetro:**
   - Metabase detectará `{{fecha_inicio}}`
   - Click en el parámetro
   - Tipo: **Date**
   - Default value: `2026-01-01`

3. **Guardar y usar:**
   - Ahora tendrás un selector de fecha arriba
   - Puedes cambiar la fecha sin tocar el SQL

---

### 📊 Parámetros Comunes

#### Filtro por Mecánico
```sql
SELECT * 
FROM "solicitudes" s
JOIN "mecanicos" m ON m.id = s."mecanicoId"
WHERE m.id = {{mecanico_id}}
```

Configuración del parámetro:
- Tipo: **Number**
- O mejor: **Field Filter** → `mecanicos.id`

---

#### Filtro por Rango de Fechas
```sql
SELECT 
  DATE("createdAt") as fecha,
  SUM("costoManoObra" + "costoRepuestos") as ingresos
FROM "mantenimientos"
WHERE {{fecha_rango}}
GROUP BY DATE("createdAt")
ORDER BY fecha DESC;
```

Configuración:
- Tipo: **Field Filter**
- Field: `mantenimientos.createdAt`
- Widget type: **Date Range**

---

#### Filtro por Tipo de Servicio
```sql
SELECT * 
FROM "solicitudes"
WHERE "tipoServicio" = {{tipo_servicio}}
```

Configuración:
- Tipo: **Field Filter**
- Field: `solicitudes.tipoServicio`
- Widget: **Dropdown**

---

### 🔄 Modificar Consultas Existentes

**Para editar una tarjeta del dashboard:**

1. Modo edición del dashboard
2. Click en **"..."** en la tarjeta
3. **"Edit question"**
4. Modifica el SQL o filtros
5. **Save** → **Update**

---

## 🎤 3. CÓMO EXPLICAR EL DASHBOARD {#explicar}

### 📝 GUIÓN DE PRESENTACIÓN PROFESIONAL

---

#### **INTRODUCCIÓN (1 minuto)**

> "Buenos días/tardes. Hoy les presento el **Dashboard de Business Intelligence de MecanicCompany**, una herramienta desarrollada para transformar nuestros datos operacionales en decisiones estratégicas.
>
> Este dashboard nos permite visualizar en tiempo real el rendimiento del taller, identificar oportunidades de mejora y optimizar nuestros recursos."

---

#### **SECCIÓN 1: INDICADORES CLAVE (KPIs) - 2 minutos**

**Apunta a los números grandes en la parte superior:**

> **1. Ingresos del Mes** 💰
> - "Este indicador muestra los ingresos totales generados en el mes actual."
> - "Incluye tanto mano de obra como repuestos."
> - "Actualmente tenemos **$[valor]** en ingresos este mes."
> - **Utilidad:** "Nos ayuda a monitorear si cumplimos nuestras metas mensuales."

> **2. Servicios Completados** 📊
> - "Total de mantenimientos finalizados en el mes."
> - "Este mes hemos completado **[X] servicios**."
> - **Utilidad:** "Medimos la productividad del equipo."

> **3. Promedio por Servicio** 📈
> - "Ticket promedio que genera cada servicio."
> - "Nuestro promedio actual es de **$[valor]**."
> - **Utilidad:** "Identificamos si debemos ajustar precios o promover servicios de mayor valor."

> **4. Solicitudes Pendientes** ⏰
> - "Servicios que aún no han sido completados."
> - "Tenemos **[X] solicitudes pendientes**."
> - **Utilidad:** "Gestionamos la carga de trabajo y evitamos cuellos de botella."

---

#### **SECCIÓN 2: TENDENCIAS Y ANÁLISIS - 3 minutos**

**Gráfico de línea (Tendencia de Ingresos):**

> "Este gráfico muestra la evolución de nuestros ingresos en los últimos 6 meses.
>
> - **Observación clave:** [Menciona si hay crecimiento, estabilidad o caída]
> - **Ejemplo:** 'Podemos ver un crecimiento sostenido desde marzo, con un pico en mayo.'
> - **Acción:** 'Esto nos indica que las estrategias de marketing implementadas están funcionando.'"

---

**Gráfico de barras (Top 5 Mecánicos):**

> "Aquí identificamos a nuestros mecánicos más productivos del mes.
>
> - **Líder actual:** '[Nombre del mecánico] con [X] servicios realizados.'
> - **Utilidad:** 
>   - Reconocer el desempeño destacado.
>   - Identificar necesidades de capacitación para otros mecánicos.
>   - Distribuir cargas de trabajo de manera equitativa."

---

**Gráfico circular (Servicios por Tipo):**

> "Esta visualización muestra la distribución de nuestros servicios.
>
> - **Tipo más común:** '[Tipo de servicio] representa el [X]% del total.'
> - **Utilidad:**
>   - Optimizar inventario de repuestos.
>   - Asignar personal especializado.
>   - Identificar servicios de alta demanda."

---

#### **SECCIÓN 3: TOMA DE DECISIONES - 2 minutos**

> "Este dashboard no solo muestra números, **respalda decisiones:**
>
> **Ejemplo 1:** Si vemos que las solicitudes pendientes aumentan, podemos:
> - Contratar más mecánicos temporalmente.
> - Redistribuir cargas de trabajo.
> - Optimizar horarios.
>
> **Ejemplo 2:** Si un tipo de servicio domina, podemos:
> - Invertir en herramientas especializadas.
> - Capacitar al equipo en esa área.
> - Crear promociones para servicios menos demandados.
>
> **Ejemplo 3:** Si un mecánico tiene baja productividad:
> - Ofrecer capacitación.
> - Revisar asignaciones de tareas.
> - Identificar problemas operacionales."

---

#### **CIERRE (1 minuto)**

> "En resumen, este dashboard nos brinda:
> 
> ✅ **Visibilidad total** de nuestras operaciones
> ✅ **Datos en tiempo real** para decisiones rápidas
> ✅ **Identificación de oportunidades** de mejora
> ✅ **Métricas claras** para medir nuestro éxito
>
> **Próximos pasos:**
> - Revisar este dashboard semanalmente en reuniones de equipo.
> - Establecer metas basadas en estos indicadores.
> - Capacitar al equipo en interpretación de datos.
>
> ¿Tienen alguna pregunta?"

---

## 🎯 TIPS PARA UNA PRESENTACIÓN EXITOSA

### ✅ Antes de presentar:
- [ ] Actualiza los datos (ejecuta el script de exportación)
- [ ] Verifica que todas las visualizaciones carguen correctamente
- [ ] Prepara 2-3 insights específicos (hallazgos interesantes)
- [ ] Ten ejemplos concretos de decisiones que el dashboard puede apoyar

### ✅ Durante la presentación:
- **Usa ejemplos reales:** "El mes pasado, gracias a este dashboard, identificamos..."
- **Sé interactivo:** Permite a la audiencia hacer preguntas
- **Muestra filtros en acción:** Cambia fechas, filtra por mecánico, etc.
- **Destaca el valor:** Siempre conecta los datos con decisiones de negocio

### ✅ Preguntas frecuentes y respuestas:

**P: ¿Cada cuánto se actualizan los datos?**
R: "Los datos se actualizan [diariamente/semanalmente] mediante un proceso automatizado."

**P: ¿Puedo ver datos de meses anteriores?**
R: "Sí, podemos filtrar por cualquier rango de fechas. Déjame mostrarte..."

**P: ¿Cómo se calcula el promedio por servicio?**
R: "Sumamos mano de obra + repuestos de todos los servicios, y dividimos entre el total de servicios."

**P: ¿Puedo exportar estos datos?**
R: "Sí, Metabase permite exportar a Excel, CSV o PDF."

---

## 📚 RECURSOS ADICIONALES

### Archivos de apoyo en tu carpeta `/importante`:
- `CONSULTAS_DASHBOARD_METABASE.md` → Más consultas SQL
- `consultas-sql-metabase.sql` → Consultas avanzadas
- `GUIA_PERSONALIZACION_DASHBOARD.md` → Cómo cambiar colores y diseño
- `README_DASHBOARD_BI.md` → Guía técnica completa

### Comandos útiles para gestión:

**Iniciar Metabase:**
```powershell
cd importante
.\iniciar-metabase.ps1
```

**Actualizar datos:**
```powershell
cd backend
npm run export:powerbi
```

**Ver logs de PostgreSQL:**
```powershell
docker logs postgres-mecaniccompany
```

---

## 🎓 EJERCICIOS PRÁCTICOS

### Ejercicio 1: Crear consulta de ingresos por semana
```sql
-- TU TURNO: Completa esta consulta
SELECT 
  TO_CHAR("createdAt", 'YYYY-IW') as "Semana",
  SUM(_______ + _______) as "Ingresos"
FROM "_______"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '_____ days'
GROUP BY _______
ORDER BY "Semana" DESC;
```

<details>
<summary>Ver solución</summary>

```sql
SELECT 
  TO_CHAR("createdAt", 'YYYY-IW') as "Semana",
  SUM("costoManoObra" + "costoRepuestos") as "Ingresos"
FROM "mantenimientos"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY TO_CHAR("createdAt", 'YYYY-IW')
ORDER BY "Semana" DESC;
```
</details>

---

### Ejercicio 2: Agregar filtro interactivo
Modifica esta consulta para que el usuario pueda seleccionar el mecánico:

```sql
-- ANTES (sin filtro)
SELECT * FROM "solicitudes" WHERE "mecanicoId" = 1;

-- DESPUÉS (con parámetro)
SELECT * FROM "solicitudes" WHERE "mecanicoId" = ________;
```

<details>
<summary>Ver solución</summary>

```sql
SELECT * FROM "solicitudes" WHERE "mecanicoId" = {{mecanico_id}};
```

Luego configura el parámetro:
- Tipo: Number
- Default: 1
</details>

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "column does not exist"
**Causa:** Nombre de columna incorrecto
**Solución:** Verifica los nombres exactos en `schema.prisma`:
```
"costoManoObra" ✅  (con comillas y mayúscula)
costoManoObra ❌
```

### ❌ No se muestran datos recientes
**Causa:** Datos no exportados a PostgreSQL
**Solución:**
```powershell
cd backend
npm run export:powerbi
```

### ❌ Metabase no inicia
**Causa:** Docker no está corriendo
**Solución:**
```powershell
cd importante
docker-compose up -d
```

---

## ✨ CONCLUSIÓN

Con esta guía ya puedes:
- ✅ Crear consultas personalizadas visuales y en SQL
- ✅ Modificar valores y agregar filtros dinámicos
- ✅ Explicar el dashboard de forma profesional a cualquier audiencia
- ✅ Resolver problemas comunes

**¡Éxito con tu presentación!** 🚀

---

**Última actualización:** Julio 2026
**Versión:** 1.0
**Autor:** Sistema BI MecanicCompany
