// test-user-setup.ts
// Script para crear un usuario de prueba con contraseña conocida

import bcrypt from 'bcryptjs';
import prisma from './src/lib/prisma';

async function main() {
  const emailMecanico = 'test@mecanic.com';
  const passwordTest = 'Test123!'; // Contraseña de prueba

  console.log('🔧 Creando usuario de prueba...');
  console.log(`📧 Email: ${emailMecanico}`);
  console.log(`🔑 Contraseña: ${passwordTest}`);

  const hashedPassword = await bcrypt.hash(passwordTest, 10);

  try {
    // Verificar si ya existe
    const existente = await prisma.mecanico.findUnique({
      where: { correoEmpresarial: emailMecanico },
    });

    if (existente) {
      console.log('✅ Usuario ya existe, actualizando contraseña...');
      const updated = await prisma.mecanico.update({
        where: { correoEmpresarial: emailMecanico },
        data: { contrasena: hashedPassword, cuentaActiva: true },
      });
      console.log('✅ Contraseña actualizada:', updated.id);
    } else {
      console.log('✨ Creando nuevo usuario...');
      const newUser = await prisma.mecanico.create({
        data: {
          correoEmpresarial: emailMecanico,
          nombres: 'Usuario',
          apellidos: 'Test',
          contrasena: hashedPassword,
          especialidad: 'General',
          estadoLaboral: 'Disponible',
          cuentaActiva: true,
          cedula: '9999999999',
          telefono: '0999999999',
          ciudad: 'Quito',
        },
      });
      console.log('✅ Usuario creado:', newUser.id);
    }

    console.log('\n✅ LISTO PARA PROBAR');
    console.log('════════════════════════════════════════');
    console.log(`Email:      ${emailMecanico}`);
    console.log(`Contraseña: ${passwordTest}`);
    console.log('════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
