# 📊 CONSULTAS SQL LISTAS PARA DASHBOARD MECANICCOMPANY
# Copia y pega estas consultas en Metabase

## ===================================================================
## 1️⃣ INGRESOS DEL MES ACTUAL
## ===================================================================
## Tipo de visualización: NUMBER (Número grande)
## Formato: Moneda ($)
## -------------------------------------------------------------------

SELECT 
  COALESCE(SUM("costoManoObra" + "costoRepuestos"), 0) AS "Total Ingresos"
FROM "mantenimientos"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);


## ===================================================================
## 2️⃣ TOTAL DE SERVICIOS COMPLETADOS (MES ACTUAL)
## ===================================================================
## Tipo de visualización: NUMBER
## -------------------------------------------------------------------

SELECT 
  COUNT(*) AS "Servicios Completados"
FROM "mantenimientos"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);


## ===================================================================
## 3️⃣ PROMEDIO DE INGRESOS POR SERVICIO
## ===================================================================
## Tipo de visualización: NUMBER
## Formato: Moneda ($)
## -------------------------------------------------------------------

SELECT 
  COALESCE(AVG("costoManoObra" + "costoRepuestos"), 0) AS "Promedio por Servicio"
FROM "mantenimientos"
WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE);


## ===================================================================
## 4️⃣ SOLICITUDES PENDIENTES
## ===================================================================
## Tipo de visualización: NUMBER
## Color: Amarillo/Naranja
## -------------------------------------------------------------------

SELECT 
  COUNT(*) AS "Solicitudes Pendientes"
FROM "solicitudes"
WHERE "estado" = 'Pendiente';


## ===================================================================
## 5️⃣ TOP 5 MECÁNICOS CON MÁS SERVICIOS
## ===================================================================
## Tipo de visualización: BAR CHART (Gráfico de barras horizontal)
## -------------------------------------------------------------------

SELECT 
  m."nombres" || ' ' || m."apellidos" AS "Mecánico",
  COUNT(man.id) AS "Servicios Realizados"
FROM "mecanicos" m
LEFT JOIN "solicitudes" s ON s."mecanicoId" = m.id
LEFT JOIN "mantenimientos" man ON man."solicitudId" = s.id
WHERE man.id IS NOT NULL
GROUP BY m.id, m."nombres", m."apellidos"
ORDER BY "Servicios Realizados" DESC
LIMIT 5;


## ===================================================================
## 6️⃣ TENDENCIA DE INGRESOS POR MES (ÚLTIMOS 6 MESES)
## ===================================================================
## Tipo de visualización: LINE CHART (Gráfico de línea)
## Eje X: Mes
## Eje Y: Ingresos
## -------------------------------------------------------------------

SELECT 
  TO_CHAR("createdAt", 'YYYY-MM') AS "Mes",
  SUM("costoManoObra" + "costoRepuestos") AS "Ingresos"
FROM "mantenimientos"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
ORDER BY "Mes";


## ===================================================================
## 7️⃣ DISTRIBUCIÓN DE SERVICIOS POR TIPO
## ===================================================================
## Tipo de visualización: PIE CHART o DONUT CHART
## -------------------------------------------------------------------

SELECT 
  s."tipoServicio" AS "Tipo de Servicio",
  COUNT(*) AS "Cantidad"
FROM "solicitudes" s
INNER JOIN "mantenimientos" m ON m."solicitudId" = s.id
GROUP BY s."tipoServicio"
ORDER BY "Cantidad" DESC;


## ===================================================================
## 8️⃣ INGRESOS POR MECÁNICO (MES ACTUAL)
## ===================================================================
## Tipo de visualización: BAR CHART
## -------------------------------------------------------------------

SELECT 
  man."mecanicoAsignado" AS "Mecánico",
  SUM(man."costoManoObra" + man."costoRepuestos") AS "Ingresos Generados"
FROM "mantenimientos" man
WHERE DATE_TRUNC('month', man."createdAt") = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY man."mecanicoAsignado"
ORDER BY "Ingresos Generados" DESC;


## ===================================================================
## 9️⃣ EVOLUCIÓN DE SOLICITUDES (PENDIENTES VS COMPLETADAS)
## ===================================================================
## Tipo de visualización: AREA CHART o STACKED BAR
## -------------------------------------------------------------------

SELECT 
  TO_CHAR("createdAt", 'YYYY-MM-DD') AS "Fecha",
  "estado" AS "Estado",
  COUNT(*) AS "Cantidad"
FROM "solicitudes"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD'), "estado"
ORDER BY "Fecha";


## ===================================================================
## 🔟 COMPARACIÓN: INGRESOS MES ACTUAL VS MES ANTERIOR
## ===================================================================
## Tipo de visualización: NUMBER o TABLE
## -------------------------------------------------------------------

SELECT 
  COALESCE(SUM(CASE 
    WHEN DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE)
    THEN "costoManoObra" + "costoRepuestos" 
  END), 0) AS "Mes Actual",
  COALESCE(SUM(CASE 
    WHEN DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    THEN "costoManoObra" + "costoRepuestos" 
  END), 0) AS "Mes Anterior",
  COALESCE(
    ROUND(
      (SUM(CASE WHEN DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE) 
           THEN "costoManoObra" + "costoRepuestos" END) - 
       SUM(CASE WHEN DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
           THEN "costoManoObra" + "costoRepuestos" END)) / 
      NULLIF(SUM(CASE WHEN DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
                 THEN "costoManoObra" + "costoRepuestos" END), 0) * 100
    , 2)
  , 0) AS "% Variación"
FROM "mantenimientos";


## ===================================================================
## 📝 INSTRUCCIONES DE USO:
## ===================================================================
## 
## 1. En Metabase, en tu dashboard, click "Add a question"
## 2. Selecciona "Native query" (SQL personalizada)
## 3. Selecciona base de datos: MecanicCompany
## 4. Copia y pega la consulta que desees
## 5. Click "Run" para ejecutar
## 6. Selecciona el tipo de visualización indicado arriba
## 7. Click "Save" y asígnale un nombre descriptivo
## 
## ===================================================================
## 🎨 SUGERENCIA DE ORDEN EN EL DASHBOARD:
## ===================================================================
##
## FILA 1 (KPIs - Números grandes):
##   [1] Ingresos del Mes  |  [2] Servicios Completados  |  [3] Promedio por Servicio  |  [4] Pendientes
##
## FILA 2 (Tendencias):
##   [6] Gráfico de línea: Ingresos últimos 6 meses (ancho completo)
##
## FILA 3 (Rankings y distribución):
##   [5] Top 5 Mecánicos (50% ancho)  |  [7] Distribución por Tipo (50% ancho)
##
## FILA 4 (Análisis detallado):
##   [8] Ingresos por Mecánico (mes actual) - Ancho completo
##
## ===================================================================
