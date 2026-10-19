-- ===============================================================
-- SCRIPT DE EXPORTACIÓN DE DATOS PARA POWER BI
-- MecanicCompany - Dashboard BI
-- ===============================================================

-- 1. EXPORTAR DATOS DE MANTENIMIENTOS CON INFORMACIÓN COMPLETA
COPY (
  SELECT 
    m.id as mantenimiento_id,
    m."createdAt" as fecha,
    m."costoManoObra" as costo_mano_obra,
    m."costoRepuestos" as costo_repuestos,
    (m."costoManoObra" + m."costoRepuestos") as ingreso_total,
    s."tipoServicio" as tipo_servicio,
    s."estado" as estado_solicitud,
    mec."nombres" || ' ' || mec."apellidos" as mecanico,
    mec.id as mecanico_id,
    s."marcaVehiculo" as marca_vehiculo,
    s."modeloVehiculo" as modelo_vehiculo,
    EXTRACT(YEAR FROM m."createdAt") as año,
    EXTRACT(MONTH FROM m."createdAt") as mes,
    TO_CHAR(m."createdAt", 'YYYY-MM') as periodo
  FROM "mantenimientos" m
  JOIN "solicitudes" s ON m."solicitudId" = s.id
  JOIN "mecanicos" mec ON s."mecanicoId" = mec.id
  ORDER BY m."createdAt" DESC
) TO 'C:\temp\mecaniccompany_mantenimientos.csv' WITH CSV HEADER;

-- 2. EXPORTAR DATOS DE MECÁNICOS
COPY (
  SELECT 
    m.id as mecanico_id,
    m."nombres" as nombres,
    m."apellidos" as apellidos,
    m."nombres" || ' ' || m."apellidos" as nombre_completo,
    m."email" as email,
    m."telefono" as telefono,
    m."especialidad" as especialidad,
    COUNT(DISTINCT man.id) as total_servicios_realizados
  FROM "mecanicos" m
  LEFT JOIN "solicitudes" s ON s."mecanicoId" = m.id
  LEFT JOIN "mantenimientos" man ON man."solicitudId" = s.id
  GROUP BY m.id, m."nombres", m."apellidos", m."email", m."telefono", m."especialidad"
) TO 'C:\temp\mecaniccompany_mecanicos.csv' WITH CSV HEADER;

-- 3. EXPORTAR SOLICITUDES PENDIENTES
COPY (
  SELECT 
    s.id as solicitud_id,
    s."tipoServicio" as tipo_servicio,
    s."descripcion" as descripcion,
    s."estado" as estado,
    s."marcaVehiculo" as marca,
    s."modeloVehiculo" as modelo,
    s."createdAt" as fecha_solicitud,
    mec."nombres" || ' ' || mec."apellidos" as mecanico_asignado
  FROM "solicitudes" s
  LEFT JOIN "mecanicos" mec ON s."mecanicoId" = mec.id
  WHERE s."estado" = 'Pendiente'
) TO 'C:\temp\mecaniccompany_solicitudes_pendientes.csv' WITH CSV HEADER;

PRINT 'Archivos exportados exitosamente en C:\temp\';
PRINT '1. mecaniccompany_mantenimientos.csv';
PRINT '2. mecaniccompany_mecanicos.csv';
PRINT '3. mecaniccompany_solicitudes_pendientes.csv';
