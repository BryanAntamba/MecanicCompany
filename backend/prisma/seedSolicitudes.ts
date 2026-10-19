import { PrismaClient, EstadoSolicitud } from '@prisma/client';

const prisma = new PrismaClient();

// Datos de ejemplo para generar solicitudes realistas
const nombres = [
  'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Carmen', 'Pedro', 'Laura', 
  'José', 'Isabel', 'Miguel', 'Rosa', 'Francisco', 'Elena', 'Antonio',
  'Lucía', 'Manuel', 'Sara', 'David', 'Patricia', 'Javier', 'Marta',
  'Rafael', 'Julia', 'Ángel', 'Sofía', 'Diego', 'Beatriz', 'Sergio', 'Cristina'
];

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez',
  'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno',
  'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres',
  'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina'
];

const marcas = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda', 'Hyundai', 
  'Kia', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Subaru', 'Jeep'
];

const modelos = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Yaris'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Fit', 'Pilot'],
  Ford: ['Focus', 'Mustang', 'Explorer', 'F-150', 'Escape'],
  Chevrolet: ['Spark', 'Cruze', 'Malibu', 'Silverado', 'Equinox'],
  Nissan: ['Sentra', 'Versa', 'Altima', 'X-Trail', 'Frontier'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5'],
  Hyundai: ['Elantra', 'Accent', 'Tucson', 'Santa Fe', 'Sonata'],
  Kia: ['Rio', 'Forte', 'Sportage', 'Sorento', 'Soul'],
  Volkswagen: ['Jetta', 'Golf', 'Tiguan', 'Passat', 'Polo'],
  BMW: ['Serie 3', 'Serie 5', 'X3', 'X5', 'M4'],
  'Mercedes-Benz': ['Clase C', 'Clase E', 'GLA', 'GLE', 'A-Class'],
  Audi: ['A3', 'A4', 'Q5', 'Q7', 'TT'],
  Subaru: ['Impreza', 'Outback', 'Forester', 'Legacy', 'WRX'],
  Jeep: ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass', 'Renegade']
};

const tiposServicio = [
  'Cambio de aceite',
  'Revisión de frenos',
  'Alineación y balanceo',
  'Mantenimiento preventivo',
  'Diagnóstico general',
  'Cambio de batería',
  'Revisión de suspensión',
  'Cambio de neumáticos',
  'Otro'
];

const descripciones = [
  'El vehículo presenta ruidos extraños al frenar',
  'El motor hace un sonido raro al acelerar',
  'Las luces del tablero están encendidas',
  'El aire acondicionado no enfría bien',
  'El vehículo vibra al conducir',
  'Pérdida de potencia al subir pendientes',
  'Consumo excesivo de combustible',
  'Problemas al arrancar el motor',
  'El volante se siente pesado',
  'Humo del escape más oscuro de lo normal',
  'Problemas con la transmisión',
  'Neumáticos desgastados de manera irregular',
  'Sistema eléctrico fallando intermitentemente',
  'Batería se descarga rápidamente',
  'Mantenimiento programado de rutina'
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarPlaca(): string {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  return `${letras[randomInt(0, 25)]}${letras[randomInt(0, 25)]}${letras[randomInt(0, 25)]}-${numeros[randomInt(0, 9)]}${numeros[randomInt(0, 9)]}${numeros[randomInt(0, 9)]}`;
}

function generarTelefono(): string {
  return `+503 ${randomInt(6000, 7999)}-${randomInt(1000, 9999)}`;
}

function generarCorreo(nombre: string, apellido: string): string {
  const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  const aleatorio = randomInt(100, 999);
  return `${nombre.toLowerCase()}.${apellido.toLowerCase()}${aleatorio}@${randomItem(dominios)}`;
}

function generarFecha(): string {
  const hoy = new Date();
  const diasAdelante = randomInt(-15, 30); // Fechas entre 15 días atrás y 30 días adelante
  const fecha = new Date(hoy);
  fecha.setDate(fecha.getDate() + diasAdelante);
  
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function generarHora(): string {
  const hora = randomInt(8, 17); // Entre 8 AM y 5 PM
  const minuto = randomItem(['00', '15', '30', '45']);
  return `${String(hora).padStart(2, '0')}:${minuto}`;
}

async function main() {
  console.log('🚀 Iniciando seed de 500 solicitudes...');

  // Obtener mecánicos existentes para asignar algunas solicitudes
  const mecanicos = await prisma.mecanico.findMany({
    where: { cuentaActiva: true },
    select: { id: true }
  });

  console.log(`📋 Mecánicos disponibles: ${mecanicos.length}`);

  const solicitudesCreadas = [];
  const batchSize = 50; // Insertar en lotes de 50

  for (let i = 0; i < 500; i++) {
    const nombre = randomItem(nombres);
    const apellido1 = randomItem(apellidos);
    const apellido2 = randomItem(apellidos);
    const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`;
    
    const marca = randomItem(marcas);
    const modelo = randomItem(modelos[marca as keyof typeof modelos]);
    const anio = String(randomInt(2010, 2024));
    
    const tipoServicio = randomItem(tiposServicio);
    
    // Distribución de estados: más pendientes, algunas en proceso, pocas completadas
    let estado: EstadoSolicitud;
    const rand = Math.random();
    if (rand < 0.6) {
      estado = EstadoSolicitud.Pendiente;
    } else if (rand < 0.85) {
      estado = EstadoSolicitud.En_proceso;
    } else {
      estado = EstadoSolicitud.Completado;
    }

    // Asignar mecánico solo si no está pendiente (70% de probabilidad si tiene mecánicos)
    let mecanicoId: string | null = null;
    if (estado !== EstadoSolicitud.Pendiente && mecanicos.length > 0 && Math.random() > 0.3) {
      mecanicoId = randomItem(mecanicos).id;
    }

    const solicitud = {
      nombreCliente: nombreCompleto,
      telefono: generarTelefono(),
      correoCliente: generarCorreo(nombre, apellido1),
      marca,
      modelo,
      anio,
      placa: generarPlaca(),
      kilometraje: String(randomInt(5000, 250000)),
      tipoServicio,
      otroServicio: tipoServicio === 'Otro' ? 'Servicio especializado' : '',
      descripcionProblema: randomItem(descripciones),
      fechaCita: generarFecha(),
      horaCita: generarHora(),
      estado,
      mecanicoId
    };

    solicitudesCreadas.push(solicitud);

    // Insertar en lotes
    if (solicitudesCreadas.length === batchSize || i === 499) {
      await prisma.solicitud.createMany({
        data: solicitudesCreadas
      });
      console.log(`✅ Insertadas ${solicitudesCreadas.length} solicitudes (${i + 1}/500)`);
      solicitudesCreadas.length = 0; // Limpiar el array
    }
  }

  console.log('✨ ¡Seed completado! 500 solicitudes creadas exitosamente');

  // Mostrar estadísticas
  const stats = await prisma.solicitud.groupBy({
    by: ['estado'],
    _count: true
  });

  console.log('\n📊 Distribución de estados:');
  stats.forEach(stat => {
    console.log(`   ${stat.estado}: ${stat._count}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
