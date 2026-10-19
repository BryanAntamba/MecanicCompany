import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportarDatosParaPowerBI() {
  try {
    console.log('🔄 Exportando datos para Power BI...\n');

    // 1. EXPORTAR MANTENIMIENTOS CON INFORMACIÓN COMPLETA
    console.log('📊 Exportando mantenimientos...');
    const mantenimientos = await prisma.$queryRaw`
      SELECT 
        m.id as mantenimiento_id,
        m."createdAt" as fecha,
        m."costoManoObra" as costo_mano_obra,
        m."costoRepuestos" as costo_repuestos,
        (m."costoManoObra" + m."costoRepuestos") as ingreso_total,
        s."tipoServicio" as tipo_servicio,
        s."estado" as estado_solicitud,
        s."nombreCliente" as cliente,
        s."telefono" as telefono_cliente,
        s."correoCliente" as correo_cliente,
        CONCAT(mec."nombres", ' ', mec."apellidos") as mecanico,
        mec.id as mecanico_id,
        mec."especialidad" as especialidad_mecanico,
        s."marca" as marca_vehiculo,
        s."modelo" as modelo_vehiculo,
        s."anio" as año_vehiculo,
        s."placa" as placa,
        s."kilometraje" as kilometraje,
        EXTRACT(YEAR FROM m."createdAt") as año,
        EXTRACT(MONTH FROM m."createdAt") as mes,
        TO_CHAR(m."createdAt", 'YYYY-MM') as periodo
      FROM "mantenimientos" m
      JOIN "solicitudes" s ON m."solicitudId" = s.id
      JOIN "mecanicos" mec ON s."mecanicoId" = mec.id
      ORDER BY m."createdAt" DESC
    ` as any[];

    const csvMantenimientos = convertirACSV(mantenimientos);
    fs.writeFileSync('C:\\temp\\mecaniccompany_mantenimientos.csv', csvMantenimientos, 'utf8');
    console.log(`✅ Exportados ${mantenimientos.length} mantenimientos`);

    // 2. EXPORTAR MECÁNICOS CON ESTADÍSTICAS
    console.log('👷 Exportando mecánicos...');
    const mecanicos = await prisma.$queryRaw`
      SELECT 
        m.id as mecanico_id,
        m."nombres" as nombres,
        m."apellidos" as apellidos,
        CONCAT(m."nombres", ' ', m."apellidos") as nombre_completo,
        m."correo" as correo,
        m."correoEmpresarial" as correo_empresarial,
        m."especialidad" as especialidad,
        m."anosExperiencia" as años_experiencia,
        m."estadoLaboral" as estado_laboral,
        COUNT(DISTINCT man.id) as total_servicios_realizados
      FROM "mecanicos" m
      LEFT JOIN "solicitudes" s ON s."mecanicoId" = m.id
      LEFT JOIN "mantenimientos" man ON man."solicitudId" = s.id
      GROUP BY m.id, m."nombres", m."apellidos", m."correo", m."correoEmpresarial", m."especialidad", m."anosExperiencia", m."estadoLaboral"
    ` as any[];

    const csvMecanicos = convertirACSV(mecanicos);
    fs.writeFileSync('C:\\temp\\mecaniccompany_mecanicos.csv', csvMecanicos, 'utf8');
    console.log(`✅ Exportados ${mecanicos.length} mecánicos`);

    // 3. EXPORTAR SOLICITUDES PENDIENTES
    console.log('⏰ Exportando solicitudes pendientes...');
    const pendientes = await prisma.$queryRaw`
      SELECT 
        s.id as solicitud_id,
        s."tipoServicio" as tipo_servicio,
        s."descripcionProblema" as descripcion,
        s."estado" as estado,
        s."nombreCliente" as cliente,
        s."telefono" as telefono,
        s."correoCliente" as correo,
        s."marca" as marca,
        s."modelo" as modelo,
        s."anio" as año,
        s."placa" as placa,
        s."fechaCita" as fecha_cita,
        s."horaCita" as hora_cita,
        s."createdAt" as fecha_solicitud,
        CONCAT(mec."nombres", ' ', mec."apellidos") as mecanico_asignado
      FROM "solicitudes" s
      LEFT JOIN "mecanicos" mec ON s."mecanicoId" = mec.id
      WHERE s."estado" = 'Pendiente'
    ` as any[];

    const csvPendientes = convertirACSV(pendientes);
    fs.writeFileSync('C:\\temp\\mecaniccompany_solicitudes_pendientes.csv', csvPendientes, 'utf8');
    console.log(`✅ Exportadas ${pendientes.length} solicitudes pendientes`);

    console.log('\n✅ EXPORTACIÓN COMPLETADA\n');
    console.log('📁 Archivos creados en C:\\temp\\:');
    console.log('   1. mecaniccompany_mantenimientos.csv');
    console.log('   2. mecaniccompany_mecanicos.csv');
    console.log('   3. mecaniccompany_solicitudes_pendientes.csv');
    console.log('\n🎯 Ahora puedes importarlos en Power BI Desktop');

  } catch (error) {
    console.error('❌ Error exportando datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function convertirACSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeader = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      let value = row[header];
      
      // Convertir Decimal a número
      if (value && typeof value === 'object' && 'constructor' in value && value.constructor.name === 'Decimal') {
        value = Number(value);
      }
      
      // Formatear fechas
      if (value instanceof Date) {
        value = value.toISOString();
      }
      
      // Escapar comillas y valores con comas
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value ?? '';
    }).join(',');
  });

  return [csvHeader, ...csvRows].join('\n');
}

exportarDatosParaPowerBI();
