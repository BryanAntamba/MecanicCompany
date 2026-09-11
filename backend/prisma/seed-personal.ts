// Seed para crear personal de prueba (Inventario y Finanzas)
/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Contraseña común para todos los usuarios de prueba
    const hash = await bcrypt.hash('Personal123!', 12);

    // Usuario de Inventario
    const inventario = await prisma.mecanico.upsert({
        where: { correoEmpresarial: 'inventario@inventariomecanic.com' },
        update: {},
        create: {
            nombres: 'Luis Fernando',
            apellidos: 'Castro Morales',
            edad: 28,
            correo: 'luis.castro@gmail.com',
            correoEmpresarial: 'inventario@inventariomecanic.com',
            contrasena: hash,
            especialidad: 'Gestión de Inventario',
            anosExperiencia: 5,
            cuentaActiva: true,
            estadoLaboral: 'Disponible',
        },
    });

    // Usuario de Finanzas
    const finanzas = await prisma.mecanico.upsert({
        where: { correoEmpresarial: 'finanzas@finanzasmecanic.com' },
        update: {},
        create: {
            nombres: 'Patricia Isabel',
            apellidos: 'Mendoza Vargas',
            edad: 32,
            correo: 'patricia.mendoza@gmail.com',
            correoEmpresarial: 'finanzas@finanzasmecanic.com',
            contrasena: hash,
            especialidad: 'Gestión Financiera',
            anosExperiencia: 8,
            cuentaActiva: true,
            estadoLaboral: 'Disponible',
        },
    });

    console.log('✅ Personal de prueba creado:');
    console.log('\n📦 INVENTARIO:');
    console.log('   Correo Empresarial: inventario@inventariomecanic.com');
    console.log('   Contraseña: Personal123!');
    console.log('   Nombre: Luis Fernando Castro Morales');
    
    console.log('\n💰 FINANZAS:');
    console.log('   Correo Empresarial: finanzas@finanzasmecanic.com');
    console.log('   Contraseña: Personal123!');
    console.log('   Nombre: Patricia Isabel Mendoza Vargas');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
