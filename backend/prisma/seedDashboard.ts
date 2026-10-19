// Seed de datos de prueba para Dashboard BI
// Genera mantenimientos y solicitudes con datos realistas de los últimos 3 meses

import { PrismaClient, EstadoLaboral, EstadoSolicitud } from '@prisma/client';

const prisma = new PrismaClient();

// Datos realistas para el taller
const tiposServicio = [
  'Cambio de aceite',
  'Revisión de frenos',
  'Alineación y balanceo',
  'Cambio de llantas',
  'Revisión general',
  'Reparación de motor',
  'Reparación de transmisión',
  'Sistema eléctrico',
  'Aire acondicionado',
  'Suspensión'
];

const marcasVehiculos = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Hyundai', 'Kia'];
const modelos: Record<string, string[]> = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Fit'],
  Ford: ['Focus', 'Escape', 'Explorer', 'F-150'],
  Chevrolet: ['Spark', 'Cruze', 'Equinox', 'Silverado'],
  Nissan: ['Versa', 'Sentra', 'Altima', 'X-Trail'],
  Mazda: ['Mazda3', 'CX-5', 'CX-9', 'Mazda6'],
  Hyundai: ['Accent', 'Elantra', 'Tucson', 'Santa Fe'],
  Kia: ['Rio', 'Forte', 'Sportage', 'Sorento']
};

const nombresClientes = [
  { nombre: 'Carlos Méndez', telefono: '555-0101', correo: 'carlos.mendez@email.com' },
  { nombre: 'María González', telefono: '555-0102', correo: 'maria.gonzalez@email.com' },
  { nombre: 'Juan Pérez', telefono: '555-0103', correo: 'juan.perez@email.com' },
  { nombre: 'Ana Rodríguez', telefono: '555-0104', correo: 'ana.rodriguez@email.com' },
  { nombre: 'Luis Hernández', telefono: '555-0105', correo: 'luis.hernandez@email.com' },
  { nombre: 'Patricia Martínez', telefono: '555-0106', correo: 'patricia.martinez@email.com' },
  { nombre: 'Roberto Silva', telefono: '555-0107', correo: 'roberto.silva@email.com' },
  { nombre: 'Laura Torres', telefono: '555-0108', correo: 'laura.torres@email.com' },
  { nombre: 'Diego Ramírez', telefono: '555-0109', correo: 'diego.ramirez@email.com' },
  { nombre: 'Carmen Flores', telefono: '555-0110', correo: 'carmen.flores@email.com' }
];

// Generar fecha aleatoria en los últimos N días
function randomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now);
  date.setDate(date.getDate() - randomDays);
  return date;
}

// Generar placa aleatoria
function randomPlaca(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}-${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}${numbers[Math.floor(Math.random() * 10)]}`;
}

// Generar costo realista según tipo de servicio
function getCosto(tipoServicio: string): { manoObra: number; repuestos: number } {
  const costos: { [key: string]: { manoObra: [number, number]; repuestos: [number, number] } } = {
    'Cambio de aceite': { manoObra: [150, 250], repuestos: [300, 500] },
    'Revisión de frenos': { manoObra: [200, 350], repuestos: [500, 1200] },
    'Alineación y balanceo': { manoObra: [180, 280], repuestos: [50, 150] },
    'Cambio de llantas': { manoObra: [100, 200], repuestos: [2000, 4000] },
    'Revisión general': { manoObra: [300, 500], repuestos: [200, 600] },
    'Reparación de motor': { manoObra: [800, 1500], repuestos: [2000, 5000] },
    'Reparación de transmisión': { manoObra: [1000, 2000], repuestos: [3000, 7000] },
    'Sistema eléctrico': { manoObra: [250, 450], repuestos: [300, 800] },
    'Aire acondicionado': { manoObra: [200, 400], repuestos: [400, 1000] },
    'Suspensión': { manoObra: [300, 600], repuestos: [800, 2000] }
  };

  const config = costos[tipoServicio] || { manoObra: [200, 400], repuestos: [300, 800] };
  
  return {
    manoObra: Math.floor(Math.random() * (config.manoObra[1] - config.manoObra[0]) + config.manoObra[0]),
    repuestos: Math.floor(Math.random() * (config.repuestos[1] - config.repuestos[0]) + config.repuestos[0])
  };
}

async function seedDashboardData() {
  console.log('🌱 Iniciando seed de datos para Dashboard BI...\n');

  try {
    // 1. Obtener mecánicos existentes
    const mecanicos = await prisma.mecanico.findMany();
    
    if (mecanicos.length === 0) {
      console.log('⚠️  No hay mecánicos en la base de datos. Ejecuta primero: npm run seed');
      return;
    }

    console.log(`✓ Encontrados ${mecanicos.length} mecánicos`);

    // 2. Limpiar datos existentes (opcional)
    await prisma.mantenimiento.deleteMany();
    await prisma.solicitud.deleteMany();
    console.log('✓ Datos anteriores limpiados');

    // 3. Generar 30 solicitudes con mantenimientos de los últimos 90 días
    const solicitudesData = [];
    
    for (let i = 0; i < 30; i++) {
      const cliente = nombresClientes[Math.floor(Math.random() * nombresClientes.length)];
      const marca = marcasVehiculos[Math.floor(Math.random() * marcasVehiculos.length)];
      const modelo = modelos[marca][Math.floor(Math.random() * modelos[marca].length)];
      const tipoServicio = tiposServicio[Math.floor(Math.random() * tiposServicio.length)];
      const mecanico = mecanicos[Math.floor(Math.random() * mecanicos.length)];
      
      const fechaCreacion = randomDate(90); // Últimos 90 días
      const costos = getCosto(tipoServicio);

      solicitudesData.push({
        cliente,
        marca,
        modelo,
        tipoServicio,
        mecanico,
        fechaCreacion,
        costos
      });
    }

    // Ordenar por fecha para crear datos cronológicos
    solicitudesData.sort((a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime());

    let serviciosCreados = 0;

    for (const data of solicitudesData) {
      // Crear solicitud
      const solicitud = await prisma.solicitud.create({
        data: {
          nombreCliente: data.cliente.nombre,
          telefono: data.cliente.telefono,
          correoCliente: data.cliente.correo,
          marca: data.marca,
          modelo: data.modelo,
          anio: String(2018 + Math.floor(Math.random() * 6)), // 2018-2023
          placa: randomPlaca(),
          kilometraje: String(10000 + Math.floor(Math.random() * 150000)),
          tipoServicio: data.tipoServicio,
          descripcionProblema: `Servicio de ${data.tipoServicio.toLowerCase()} solicitado por el cliente`,
          fechaCita: data.fechaCreacion.toISOString().split('T')[0],
          horaCita: `${8 + Math.floor(Math.random() * 8)}:00`,
          estado: EstadoSolicitud.Completado,
          mecanicoId: data.mecanico.id,
          createdAt: data.fechaCreacion,
          updatedAt: data.fechaCreacion
        }
      });

      // Crear mantenimiento asociado
      const fechaInicio = new Date(data.fechaCreacion);
      const horasServicio = 2 + Math.floor(Math.random() * 6); // 2-8 horas
      const fechaFin = new Date(fechaInicio);
      fechaFin.setHours(fechaFin.getHours() + horasServicio);

      await prisma.mantenimiento.create({
        data: {
          solicitudId: solicitud.id,
          marca: data.marca,
          modelo: data.modelo,
          placa: solicitud.placa,
          mecanicoAsignado: `${data.mecanico.nombres} ${data.mecanico.apellidos}`,
          diagnostico: `Diagnóstico de ${data.tipoServicio}`,
          trabajoRealizado: data.tipoServicio,
          repuestosUtilizados: `Repuestos estándar para ${data.tipoServicio}`,
          diagnosticoRealizado: `Se completó ${data.tipoServicio.toLowerCase()} según estándares del taller`,
          observaciones: 'Servicio completado satisfactoriamente',
          costoManoObra: data.costos.manoObra,
          costoRepuestos: data.costos.repuestos,
          fechaServicio: data.fechaCreacion.toISOString().split('T')[0],
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFinalizacion: fechaFin.toISOString().split('T')[0],
          createdAt: data.fechaCreacion,
          updatedAt: data.fechaCreacion
        }
      });

      serviciosCreados++;
      process.stdout.write(`\r✓ Servicios creados: ${serviciosCreados}/30`);
    }

    console.log('\n');

    // 4. Agregar algunas solicitudes pendientes (sin mantenimiento)
    for (let i = 0; i < 5; i++) {
      const cliente = nombresClientes[Math.floor(Math.random() * nombresClientes.length)];
      const marca = marcasVehiculos[Math.floor(Math.random() * marcasVehiculos.length)];
      const modelo = modelos[marca][Math.floor(Math.random() * modelos[marca].length)];
      const tipoServicio = tiposServicio[Math.floor(Math.random() * tiposServicio.length)];
      
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + Math.floor(Math.random() * 7));

      await prisma.solicitud.create({
        data: {
          nombreCliente: cliente.nombre,
          telefono: cliente.telefono,
          correoCliente: cliente.correo,
          marca,
          modelo,
          anio: String(2020 + Math.floor(Math.random() * 4)),
          placa: randomPlaca(),
          kilometraje: String(5000 + Math.floor(Math.random() * 80000)),
          tipoServicio,
          descripcionProblema: `Solicitud de ${tipoServicio.toLowerCase()}`,
          fechaCita: fechaFutura.toISOString().split('T')[0],
          horaCita: `${9 + Math.floor(Math.random() * 7)}:00`,
          estado: EstadoSolicitud.Pendiente
        }
      });
    }

    console.log('✓ 5 solicitudes pendientes agregadas');

    // 5. Resumen
    const totalMantenimientos = await prisma.mantenimiento.count();
    const totalSolicitudes = await prisma.solicitud.count();
    const ingresoTotal = await prisma.mantenimiento.aggregate({
      _sum: {
        costoManoObra: true,
        costoRepuestos: true
      }
    });

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📊 RESUMEN:');
    console.log(`   • Total de solicitudes: ${totalSolicitudes}`);
    console.log(`   • Mantenimientos completados: ${totalMantenimientos}`);
    console.log(`   • Solicitudes pendientes: ${totalSolicitudes - totalMantenimientos}`);
    
    const totalManoObra = Number(ingresoTotal._sum.costoManoObra || 0);
    const totalRepuestos = Number(ingresoTotal._sum.costoRepuestos || 0);
    console.log(`   • Ingreso total generado: $${(totalManoObra + totalRepuestos).toLocaleString()}`);
    console.log('\n✨ ¡Listo para ver el dashboard en Metabase!');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDashboardData();
