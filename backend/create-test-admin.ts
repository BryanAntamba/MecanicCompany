import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from './src/lib/prisma';

async function main() {
  const email = 'admin@mecanic.com';
  const plainPassword = 'admin123';

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Crear o actualizar admin
  const admin = await prisma.admin.upsert({
    where: { correoEmpresarial: email },
    update: {
      contrasena: hashedPassword,
    },
    create: {
      nombres: 'Admin',
      apellidos: 'Test',
      correo: 'admin.personal@gmail.com',
      correoEmpresarial: email,
      contrasena: hashedPassword,
    },
  });

  console.log('✅ Admin configurado exitosamente!');
  console.log('📧 Email para login:', email);
  console.log('🔑 Contraseña:', plainPassword);
  console.log('ID:', admin.id);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
