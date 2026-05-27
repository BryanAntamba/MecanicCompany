// Seed inicial: crea el usuario administrador en su propia tabla
/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('Admin123!', 12);

    // Elimina el admin de la tabla mecanicos si existía (migración de datos)
    await prisma.mecanico.deleteMany({
        where: { correoEmpresarial: 'admin@mecanic.com' },
    });

    // Crea el admin en su propia tabla
    await prisma.admin.upsert({
        where: { correoEmpresarial: 'admin@mecanic.com' },
        update: {},
        create: {
            nombres: 'Administrador',
            apellidos: 'Sistema',
            correo: 'admin@gmail.com',
            correoEmpresarial: 'admin@mecanic.com',
            contrasena: hash,
        },
    });

    console.log('✅ Seed completado: admin@mecanic.com creado en tabla admins');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
