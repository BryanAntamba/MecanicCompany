import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('➕ Creando cliente de prueba...\n');

    // Hashear contraseña
    const contrasenaHash = await bcrypt.hash('Test123456', 12);

    // Crear cliente
    const cliente = await prisma.cliente.create({
      data: {
        nombres: 'Juan',
        apellidos: 'Pérez García',
        telefono: '3101234567',
        correo: 'juan@gmail.com',
        contrasena: contrasenaHash,
        cuentaActiva: true, // Ya verificado para pruebas
        fotoPerfil: null,
      },
    });

    console.log('✅ Cliente creado exitosamente!\n');
    console.log('📋 Datos del cliente:');
    console.log(`   - ID: ${cliente.id}`);
    console.log(`   - Nombre: ${cliente.nombres} ${cliente.apellidos}`);
    console.log(`   - Correo: ${cliente.correo}`);
    console.log(`   - Teléfono: ${cliente.telefono}`);
    console.log(`   - Cuenta Activa: ${cliente.cuentaActiva}\n`);

    console.log('🔑 Credenciales para login:');
    console.log(`   Correo: ${cliente.correo}`);
    console.log(`   Contraseña: Test123456\n`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
