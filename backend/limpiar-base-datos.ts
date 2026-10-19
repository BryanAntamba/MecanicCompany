import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🗑️  Iniciando limpieza de la base de datos...\n');

    // Contar usuarios antes de eliminar
    const mecanicosAntes = await prisma.mecanico.count();
    const adminsAntes = await prisma.admin.count();
    const clientesAntes = await prisma.cliente.count();

    console.log(`📊 Estado ANTES de limpiar:`);
    console.log(`   - Mecánicos: ${mecanicosAntes}`);
    console.log(`   - Administradores: ${adminsAntes}`);
    console.log(`   - Clientes: ${clientesAntes}\n`);

    // Eliminar datos (en orden de dependencias)
    console.log('🧹 Eliminando datos...');

    // Limpiar Solicitudes primero (tiene referencias a Mecánico y Cliente)
    const solicitudesEliminadas = await prisma.solicitud.deleteMany();
    console.log(`   ✓ Eliminadas ${solicitudesEliminadas.count} solicitudes`);

    // Limpiar Mantenimientos
    const mantenimientosEliminados = await prisma.mantenimiento.deleteMany();
    console.log(`   ✓ Eliminados ${mantenimientosEliminados.count} mantenimientos`);

    // Limpiar Códigos de Verificación
    const codigosEliminados = await prisma.codigoVerificacion.deleteMany();
    console.log(`   ✓ Eliminados ${codigosEliminados.count} códigos de verificación`);

    // Limpiar Clientes
    const clientesEliminados = await prisma.cliente.deleteMany();
    console.log(`   ✓ Eliminados ${clientesEliminados.count} clientes`);

    // Limpiar Mecánicos
    const mecanicosEliminados = await prisma.mecanico.deleteMany();
    console.log(`   ✓ Eliminados ${mecanicosEliminados.count} mecánicos`);

    // Limpiar Administradores
    const adminsEliminados = await prisma.admin.deleteMany();
    console.log(`   ✓ Eliminados ${adminsEliminados.count} administradores\n`);

    // Contar usuarios después de eliminar
    const mecanicosDepues = await prisma.mecanico.count();
    const adminsDepues = await prisma.admin.count();
    const clientesDepues = await prisma.cliente.count();

    console.log(`📊 Estado DESPUÉS de limpiar:`);
    console.log(`   - Mecánicos: ${mecanicosDepues}`);
    console.log(`   - Administradores: ${adminsDepues}`);
    console.log(`   - Clientes: ${clientesDepues}\n`);

    console.log('✅ Base de datos limpiada exitosamente!');
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
