import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🗑️  Limpiando base de datos...\n');

    // Eliminar en orden de dependencias
    await prisma.solicitud.deleteMany();
    console.log('✓ Solicitudes eliminadas');

    await prisma.mantenimiento.deleteMany();
    console.log('✓ Mantenimientos eliminados');

    await prisma.codigoVerificacion.deleteMany();
    console.log('✓ Códigos de verificación eliminados');

    await prisma.cliente.deleteMany();
    console.log('✓ Clientes eliminados');

    await prisma.mecanico.deleteMany();
    console.log('✓ Mecánicos eliminados');

    await prisma.admin.deleteMany();
    console.log('✓ Administradores eliminados\n');

    console.log('✅ BD limpia!\n');

    // Crear un cliente de prueba
    console.log('📝 Creando cliente de prueba...\n');

    const clientePrueba = await prisma.cliente.create({
      data: {
        nombres: 'Juan',
        apellidos: 'Pérez García',
        telefono: '3001234567',
        correo: 'juan@gmail.com',
        contrasena: await bcrypt.hash('Test123!', 12),
        cuentaActiva: true,
        fotoPerfil: null,
      },
    });

    console.log('✅ Cliente creado exitosamente!\n');
    console.log('📊 Datos del cliente:');
    console.log(`   ID: ${clientePrueba.id}`);
    console.log(`   Nombres: ${clientePrueba.nombres}`);
    console.log(`   Apellidos: ${clientePrueba.apellidos}`);
    console.log(`   Correo: ${clientePrueba.correo}`);
    console.log(`   Cuenta Activa: ${clientePrueba.cuentaActiva}\n`);

    console.log('💡 Puedes usar estas credenciales para login:');
    console.log(`   Correo: ${clientePrueba.correo}`);
    console.log(`   Contraseña: Test123!\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
