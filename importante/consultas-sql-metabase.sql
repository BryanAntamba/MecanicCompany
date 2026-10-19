-- ===================================================================
-- CONSULTAS SQL PARA METABASE - MECANICCOMPANY
-- ===================================================================
-- Autor: Sistema BI MecanicCompany
-- Descripción: Colección de queries SQL optimizadas para crear
--              visualizaciones en Metabase
-- Uso: Copiar y pegar en "Nueva Pregunta" → "SQL Nativo"
-- ===================================================================

-- ===================================================================
-- DASHBOARD 1: VISIÓN GENERAL OPERACIONAL
-- ===================================================================

-- --------------------------------------------------------------------
-- KPI 1: Total de Mantenimientos del Mes Actual
-- Tipo: Número (Number)
-- --------------------------------------------------------------------
SELECT COUNT(*) as total_mantenimientos
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);

-- --------------------------------------------------------------------
-- KPI 2: Ingresos Totales del Mes Actual
-- Tipo: Número (Currency - USD)
-- --------------------------------------------------------------------
SELECT SUM("costoManoObra" + "costoRepuestos") as ingresos_totales
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);

-- --------------------------------------------------------------------
-- KPI 3: Ticket Promedio (Ingreso por Servicio)
-- Tipo: Número (Currency)
-- --------------------------------------------------------------------
SELECT AVG("costoManoObra" + "costoRepuestos") as ticket_promedio
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);

-- --------------------------------------------------------------------
-- KPI 4: Tasa de Conversión (Solicitudes → Mantenimientos Completados)
-- Tipo: Número (Porcentaje)
-- --------------------------------------------------------------------
SELECT 
  ROUND(
    (COUNT(CASE WHEN s.estado = 'Completado' THEN 1 END)::DECIMAL / 
     NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as tasa_conversion_porcentaje
FROM "Solicitud" s
WHERE DATE_TRUNC('month', s."createdAt") = DATE_TRUNC('month', CURRENT_DATE);

-- --------------------------------------------------------------------
-- GRÁFICO 1: Ingresos por Mes (Últimos 12 meses)
-- Tipo: Línea (Line Chart)
-- Drill Down: Configurar en Metabase para ver por día
-- --------------------------------------------------------------------
SELECT 
  TO_CHAR("createdAt", 'YYYY-MM') as mes,
  SUM("costoManoObra" + "costoRepuestos") as ingresos_totales
FROM "Mantenimiento"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY mes
ORDER BY mes ASC;

-- --------------------------------------------------------------------
-- GRÁFICO 2: Top 5 Mecánicos por Ingresos Generados
-- Tipo: Barras Horizontales
-- --------------------------------------------------------------------
SELECT 
  m.nombres || ' ' || m.apellidos as mecanico,
  m.especialidad,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_generados
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos, m.especialidad
ORDER BY ingresos_generados DESC
LIMIT 5;

-- --------------------------------------------------------------------
-- GRÁFICO 3: Distribución de Tipos de Servicio (Pie Chart)
-- Tipo: Dona (Donut/Pie)
-- --------------------------------------------------------------------
SELECT 
  s."tipoServicio",
  COUNT(*) as cantidad,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as porcentaje
FROM "Solicitud" s
WHERE s."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s."tipoServicio"
ORDER BY cantidad DESC;

-- ===================================================================
-- DASHBOARD 2: PRODUCTIVIDAD DE MECÁNICOS
-- ===================================================================

-- --------------------------------------------------------------------
-- TABLA: Ranking de Mecánicos por Productividad
-- Tipo: Tabla (Table)
-- --------------------------------------------------------------------
SELECT 
  m.id,
  m.nombres || ' ' || m.apellidos as mecanico,
  m.especialidad,
  m."estadoLaboral",
  COUNT(mant.id) as servicios_completados,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_generados,
  ROUND(AVG(mant."costoManoObra" + mant."costoRepuestos"), 2) as ticket_promedio,
  -- Calcular tiempo promedio (asumiendo fechas en formato texto, ajustar según tu formato)
  COUNT(CASE WHEN s.estado = 'Completado' THEN 1 END) as servicios_finalizados
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos, m.especialidad, m."estadoLaboral"
ORDER BY ingresos_generados DESC
LIMIT 10;

-- --------------------------------------------------------------------
-- GRÁFICO: Servicios por Mecánico por Mes
-- Tipo: Barras Apiladas (Stacked Bar)
-- Drill Down: Configurar para ver por día
-- --------------------------------------------------------------------
SELECT 
  m.nombres || ' ' || m.apellidos as mecanico,
  TO_CHAR(mant."createdAt", 'YYYY-MM') as mes,
  COUNT(mant.id) as cantidad_servicios
FROM "Mecanico" m
JOIN "Solicitud" s ON s."mecanicoId" = m.id
JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY m.id, m.nombres, m.apellidos, mes
ORDER BY mes ASC, cantidad_servicios DESC;

-- --------------------------------------------------------------------
-- GRÁFICO: Scatter Plot - Tiempo vs Ingresos por Mecánico
-- Tipo: Dispersión (Scatter)
-- Objetivo: Identificar mecánicos eficientes
-- --------------------------------------------------------------------
SELECT 
  m.nombres || ' ' || m.apellidos as mecanico,
  m.especialidad,
  COUNT(mant.id) as servicios,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_totales,
  ROUND(
    SUM(mant."costoManoObra" + mant."costoRepuestos") / NULLIF(COUNT(mant.id), 0), 
    2
  ) as ingreso_por_servicio
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos, m.especialidad
HAVING COUNT(mant.id) > 0
ORDER BY ingresos_totales DESC;

-- --------------------------------------------------------------------
-- GRÁFICO: Heatmap - Disponibilidad de Mecánicos
-- Tipo: Tabla con colores condicionales
-- --------------------------------------------------------------------
SELECT 
  m.nombres || ' ' || m.apellidos as mecanico,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 1 THEN 1 END) as lunes,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 2 THEN 1 END) as martes,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 3 THEN 1 END) as miercoles,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 4 THEN 1 END) as jueves,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 5 THEN 1 END) as viernes,
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") = 6 THEN 1 END) as sabado
FROM "Mecanico" m
LEFT JOIN "Solicitud" s ON s."mecanicoId" = m.id
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY m.id, m.nombres, m.apellidos
ORDER BY (
  COUNT(CASE WHEN EXTRACT(DOW FROM mant."createdAt") IN (1,2,3,4,5,6) THEN 1 END)
) DESC;

-- ===================================================================
-- DASHBOARD 3: ANÁLISIS FINANCIERO
-- ===================================================================

-- --------------------------------------------------------------------
-- MÉTRICA: Margen de Mano de Obra vs Repuestos
-- Tipo: Tabla o KPI dual
-- --------------------------------------------------------------------
SELECT 
  SUM("costoManoObra") as total_mano_obra,
  SUM("costoRepuestos") as total_repuestos,
  SUM("costoManoObra" + "costoRepuestos") as ingresos_totales,
  ROUND(
    (SUM("costoManoObra") / NULLIF(SUM("costoManoObra" + "costoRepuestos"), 0)) * 100,
    2
  ) as porcentaje_mano_obra,
  ROUND(
    (SUM("costoRepuestos") / NULLIF(SUM("costoManoObra" + "costoRepuestos"), 0)) * 100,
    2
  ) as porcentaje_repuestos
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);

-- --------------------------------------------------------------------
-- MÉTRICA: Crecimiento Mensual (MoM - Month over Month)
-- Tipo: Número con tendencia
-- --------------------------------------------------------------------
WITH ingresos_por_mes AS (
  SELECT 
    DATE_TRUNC('month', "createdAt") as mes,
    SUM("costoManoObra" + "costoRepuestos") as ingresos
  FROM "Mantenimiento"
  GROUP BY mes
  ORDER BY mes DESC
  LIMIT 2
)
SELECT 
  (MAX(ingresos) - MIN(ingresos)) as diferencia,
  ROUND(
    ((MAX(ingresos) - MIN(ingresos)) / NULLIF(MIN(ingresos), 0)) * 100,
    2
  ) as crecimiento_porcentaje
FROM ingresos_por_mes;

-- --------------------------------------------------------------------
-- GRÁFICO: Ingresos por Tipo de Servicio
-- Tipo: Barras Verticales
-- Drill Down: Ver mecánicos que realizan cada tipo
-- --------------------------------------------------------------------
SELECT 
  s."tipoServicio",
  SUM(mant."costoManoObra" + mant."costoRepuestos") as ingresos_totales,
  COUNT(mant.id) as cantidad_servicios,
  ROUND(
    AVG(mant."costoManoObra" + mant."costoRepuestos"),
    2
  ) as ticket_promedio
FROM "Solicitud" s
JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
WHERE mant."createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY s."tipoServicio"
ORDER BY ingresos_totales DESC;

-- --------------------------------------------------------------------
-- GRÁFICO: Embudo de Conversión
-- Tipo: Funnel o Barras Horizontales
-- --------------------------------------------------------------------
SELECT 
  '1. Solicitudes Recibidas' as etapa,
  COUNT(*) as cantidad,
  1 as orden
FROM "Solicitud"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
  '2. Solicitudes Asignadas' as etapa,
  COUNT(*) as cantidad,
  2 as orden
FROM "Solicitud"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
  AND "mecanicoId" IS NOT NULL

UNION ALL

SELECT 
  '3. En Proceso' as etapa,
  COUNT(*) as cantidad,
  3 as orden
FROM "Solicitud"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
  AND estado = 'En_proceso'

UNION ALL

SELECT 
  '4. Completados' as etapa,
  COUNT(*) as cantidad,
  4 as orden
FROM "Solicitud"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
  AND estado = 'Completado'

ORDER BY orden;

-- --------------------------------------------------------------------
-- GRÁFICO: Dual Axis - Mano de Obra vs Repuestos por Mes
-- Tipo: Línea Dual (Dual Line)
-- --------------------------------------------------------------------
SELECT 
  TO_CHAR("createdAt", 'YYYY-MM') as mes,
  SUM("costoManoObra") as costo_mano_obra,
  SUM("costoRepuestos") as costo_repuestos
FROM "Mantenimiento"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY mes
ORDER BY mes ASC;

-- ===================================================================
-- DASHBOARD 4: ANÁLISIS DE CLIENTES Y VEHÍCULOS
-- ===================================================================

-- --------------------------------------------------------------------
-- GRÁFICO: Top 10 Marcas de Vehículos Atendidas
-- Tipo: Barras Horizontales
-- --------------------------------------------------------------------
SELECT 
  s.marca,
  COUNT(*) as cantidad_servicios,
  COUNT(DISTINCT s."correoCliente") as clientes_unicos
FROM "Solicitud" s
WHERE s."createdAt" >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY s.marca
ORDER BY cantidad_servicios DESC
LIMIT 10;

-- --------------------------------------------------------------------
-- TABLA: Modelos Más Frecuentes
-- Tipo: Tabla
-- --------------------------------------------------------------------
SELECT 
  s.marca,
  s.modelo,
  ROUND(AVG(s.anio::INTEGER), 0) as anio_promedio,
  COUNT(*) as total_servicios,
  MAX(s."createdAt") as ultimo_servicio
FROM "Solicitud" s
WHERE s."createdAt" >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY s.marca, s.modelo
ORDER BY total_servicios DESC
LIMIT 15;

-- --------------------------------------------------------------------
-- TABLA: Clientes Recurrentes (Top 10)
-- Tipo: Tabla
-- --------------------------------------------------------------------
SELECT 
  s."nombreCliente",
  s."correoCliente",
  s.telefono,
  COUNT(*) as total_servicios,
  SUM(mant."costoManoObra" + mant."costoRepuestos") as gasto_acumulado,
  MAX(s."createdAt") as ultimo_servicio
FROM "Solicitud" s
LEFT JOIN "Mantenimiento" mant ON mant."solicitudId" = s.id
GROUP BY s."correoCliente", s."nombreCliente", s.telefono
HAVING COUNT(*) > 1
ORDER BY total_servicios DESC, gasto_acumulado DESC
LIMIT 10;

-- --------------------------------------------------------------------
-- GRÁFICO: Heatmap - Frecuencia de Servicios por Día/Hora
-- Tipo: Tabla con formato condicional
-- --------------------------------------------------------------------
SELECT 
  CASE EXTRACT(DOW FROM "createdAt")
    WHEN 0 THEN 'Domingo'
    WHEN 1 THEN 'Lunes'
    WHEN 2 THEN 'Martes'
    WHEN 3 THEN 'Miércoles'
    WHEN 4 THEN 'Jueves'
    WHEN 5 THEN 'Viernes'
    WHEN 6 THEN 'Sábado'
  END as dia_semana,
  COUNT(*) as total_solicitudes,
  EXTRACT(DOW FROM "createdAt") as orden_dia
FROM "Solicitud"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY dia_semana, orden_dia
ORDER BY orden_dia;

-- ===================================================================
-- CONSULTAS AVANZADAS (DRILL DOWN)
-- ===================================================================

-- --------------------------------------------------------------------
-- DRILL DOWN: Ingresos por Mes → Por Día
-- Usar con parámetro {{mes}} en Metabase
-- --------------------------------------------------------------------
SELECT 
  DATE("createdAt") as fecha,
  SUM("costoManoObra" + "costoRepuestos") as ingresos_diarios
FROM "Mantenimiento"
WHERE TO_CHAR("createdAt", 'YYYY-MM') = {{mes}}
GROUP BY fecha
ORDER BY fecha ASC;

-- --------------------------------------------------------------------
-- DRILL DOWN: Ingresos por Día → Servicios Individuales
-- Usar con parámetro {{fecha}} en Metabase
-- --------------------------------------------------------------------
SELECT 
  mant.id,
  s."nombreCliente",
  s.marca || ' ' || s.modelo as vehiculo,
  s."tipoServicio",
  mant."mecanicoAsignado",
  (mant."costoManoObra" + mant."costoRepuestos") as total,
  mant."createdAt"
FROM "Mantenimiento" mant
JOIN "Solicitud" s ON s.id = mant."solicitudId"
WHERE DATE(mant."createdAt") = {{fecha}}
ORDER BY mant."createdAt" DESC;

-- ===================================================================
-- CONSULTAS DE ANÁLISIS TEMPORAL
-- ===================================================================

-- --------------------------------------------------------------------
-- Comparativa: Mes Actual vs Mes Anterior
-- --------------------------------------------------------------------
SELECT 
  'Mes Actual' as periodo,
  COUNT(*) as total_servicios,
  SUM("costoManoObra" + "costoRepuestos") as ingresos_totales
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE)

UNION ALL

SELECT 
  'Mes Anterior' as periodo,
  COUNT(*) as total_servicios,
  SUM("costoManoObra" + "costoRepuestos") as ingresos_totales
FROM "Mantenimiento"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')

ORDER BY periodo DESC;

-- --------------------------------------------------------------------
-- Tendencia Semanal (Últimas 4 semanas)
-- --------------------------------------------------------------------
SELECT 
  DATE_TRUNC('week', "createdAt") as semana,
  COUNT(*) as total_servicios,
  SUM("costoManoObra" + "costoRepuestos") as ingresos
FROM "Mantenimiento"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '4 weeks'
GROUP BY semana
ORDER BY semana ASC;

-- ===================================================================
-- NOTAS DE USO
-- ===================================================================
-- 
-- 1. Copia la consulta que necesites
-- 2. En Metabase: Nueva → Pregunta → SQL Nativo
-- 3. Pega la consulta
-- 4. Ejecuta y visualiza
-- 5. Ajusta el tipo de gráfico según se indica
-- 6. Guarda con nombre descriptivo
-- 7. Agrega al dashboard correspondiente
--
-- PARÁMETROS:
-- - {{mes}} - Formato: 'YYYY-MM' (ejemplo: '2026-06')
-- - {{fecha}} - Formato: 'YYYY-MM-DD' (ejemplo: '2026-06-15')
--
-- TIPOS DE VISUALIZACIÓN RECOMENDADOS:
-- - KPIs: Number (formato currency o percent)
-- - Tendencias: Line Chart
-- - Comparaciones: Bar Chart (vertical u horizontal)
-- - Distribuciones: Pie/Donut Chart
-- - Rankings: Table con ordenamiento
-- - Scatter: Para correlaciones
--
-- ===================================================================
