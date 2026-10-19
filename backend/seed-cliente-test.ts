import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Limpiando base de datos...\n');

    // Limpiar en orden de dependencias
    await prisma.solicitud.deleteMany();
    await prisma.mantenimiento.deleteMany();
    await prisma.codigoVerificacion.deleteMany();
    await prisma.cliente.deleteMany();
    await prisma.mecanico.deleteMany();
    await prisma.admin.deleteMany();

    console.log('✅ Base de datos limpiada\n');

    // Crear cliente de prueba
    console.log('➕ Creando cliente de prueba...\n');

    const contrasenaHasheada = await bcrypt.hash('Contraseña123!', 12);

    const cliente = await prisma.cliente.create({
      data: {
        nombres: 'Juan',
        apellidos: 'García López',
        telefono: '3001234567',
        correo: 'juan.garcia@gmail.com',
        contrasena: contrasenaHasheada,
        cuentaActiva: true,
        fotoPerfil: null,
      },
    });

    console.log('✅ Cliente creado exitosamente:\n');
    console.log(`   ID: ${cliente.id}`);
    console.log(`   Nombres: ${cliente.nombres}`);
    console.log(`   Apellidos: ${cliente.apellidos}`);
    console.log(`   Correo: ${cliente.correo}`);
    console.log(`   Teléfono: ${cliente.telefono}`);
    console.log(`   Cuenta Activa: ${cliente.cuentaActiva}`);
    console.log(`   Fecha Creación: ${cliente.createdAt}\n`);

    console.log('🎯 Puedes usar estas credenciales para probar:');
    console.log(`   Correo: ${cliente.correo}`);
    console.log(`   Contraseña: Contraseña123!\n`);

    console.log('✨ Setup completado!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
