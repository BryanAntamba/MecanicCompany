// Seed para crear un mecánico de prueba
/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('Mecanico123!', 12);

    // Crea un mecánico de prueba
    const mecanico = await prisma.mecanico.upsert({
        where: { correoEmpresarial: 'mecanico@mecanic.com' },
        update: {},
        create: {
            nombres: 'Carlos Alberto',
            apellidos: 'Rodríguez López',
            edad: 35,
            correo: 'carlos.rodriguez@gmail.com',
            correoEmpresarial: 'mecanico@mecanic.com',
            contrasena: hash,
            especialidad: 'Motor',
            anosExperiencia: 10,
            cuentaActiva: true,
            estadoLaboral: 'Disponible',
        },
    });

    console.log('✅ Mecánico de prueba creado:');
    console.log('   Correo Empresarial: mecanico@mecanic.com');
    console.log('   Contraseña: Mecanico123!');
    console.log('   Nombre: Carlos Alberto Rodríguez López');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
