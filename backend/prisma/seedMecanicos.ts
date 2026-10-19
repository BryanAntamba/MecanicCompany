import { PrismaClient, EstadoLaboral } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const nombres = [
  'Roberto', 'Fernando', 'Alberto', 'Ricardo', 'Eduardo', 
  'Gustavo', 'Héctor', 'Óscar', 'Raúl', 'Armando'
];

const apellidos = [
  'Ramírez', 'Morales', 'Castro', 'Ortiz', 'Silva', 
  'Reyes', 'Vargas', 'Mendoza', 'Torres', 'Flores'
];

const especialidades = [
  'Mecánica general',
  'Motor y transmisión',
  'Sistema eléctrico',
  'Frenos y suspensión',
  'Aire acondicionado',
  'Diagnóstico electrónico',
  'Carrocería y pintura',
  'Alineación y balanceo',
  'Neumáticos',
  'Sistema de inyección'
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🔧 Iniciando seed de 10 mecánicos...');

  const mecanicosData = [];
  const contrasenaHash = await bcrypt.hash('Mecanico123!', 10); // Contraseña por defecto

  for (let i = 0; i < 10; i++) {
    const nombre = randomItem(nombres);
    const apellido1 = randomItem(apellidos);
    const apellido2 = randomItem(apellidos);
    
    const correoPersonal = `${nombre.toLowerCase()}.${apellido1.toLowerCase()}${randomInt(100, 999)}@gmail.com`;
    const correoEmpresarial = `${nombre.toLowerCase()}.${apellido1.toLowerCase()}${i + 1}@mecanic.com`;
    
    const edad = randomInt(22, 55);
    const anosExperiencia = randomInt(1, Math.min(edad - 18, 30));
    
    // Distribución de estados: mayoría disponibles
    let estadoLaboral: EstadoLaboral;
    const rand = Math.random();
    if (rand < 0.7) {
      estadoLaboral = EstadoLaboral.Disponible;
    } else if (rand < 0.95) {
      estadoLaboral = EstadoLaboral.Ocupado;
    } else {
      estadoLaboral = EstadoLaboral.Inactivo;
    }

    mecanicosData.push({
      nombres: nombre,
      apellidos: `${apellido1} ${apellido2}`,
      edad,
      correo: correoPersonal,
      correoEmpresarial,
      especialidad: randomItem(especialidades),
      anosExperiencia,
      estadoLaboral,
      cuentaActiva: true,
      contrasena: contrasenaHash,
      fotoPerfil: null
    });
  }

  // Insertar todos los mecánicos
  const result = await prisma.mecanico.createMany({
    data: mecanicosData,
    skipDuplicates: true // Por si acaso hay duplicados
  });

  console.log(`✅ ${result.count} mecánicos creados exitosamente`);
  console.log('🔑 Contraseña por defecto para todos: Mecanico123!');

  // Mostrar los mecánicos creados
  const mecanicos = await prisma.mecanico.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      nombres: true,
      apellidos: true,
      correoEmpresarial: true,
      especialidad: true,
      anosExperiencia: true,
      estadoLaboral: true
    }
  });

  console.log('\n👥 Mecánicos creados:');
  mecanicos.forEach((mec, idx) => {
    console.log(`   ${idx + 1}. ${mec.nombres} ${mec.apellidos}`);
    console.log(`      📧 ${mec.correoEmpresarial}`);
    console.log(`      🔧 ${mec.especialidad} (${mec.anosExperiencia} años exp.)`);
    console.log(`      📊 ${mec.estadoLaboral}`);
  });

  // Mostrar estadísticas
  const stats = await prisma.mecanico.groupBy({
    by: ['estadoLaboral'],
    _count: true
  });

  console.log('\n📊 Distribución de estados laborales:');
  stats.forEach(stat => {
    console.log(`   ${stat.estadoLaboral}: ${stat._count}`);
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
