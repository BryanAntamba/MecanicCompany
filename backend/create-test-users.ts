import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creando usuarios de prueba para todos los roles...\n');

    // Contraseña común para todos los usuarios de prueba
    const passwordPlain = 'Test123456!';
    const passwordHash = await bcrypt.hash(passwordPlain, 12);

    try {
        // 1. ADMIN
        console.log('👤 Creando ADMIN...');
        const admin = await prisma.admin.upsert({
            where: { correoEmpresarial: 'admin@mecanic.com' },
            update: { contrasena: passwordHash, cuentaActiva: true },
            create: {
                nombres: 'Juan',
                apellidos: 'Administrador',
                correo: 'admin@gmail.com',
                correoEmpresarial: 'admin@mecanic.com',
                contrasena: passwordHash,
                cuentaActiva: true,
            },
        });
        console.log(`   ✅ Admin: ${admin.correoEmpresarial}`);

        // 2. MECANICO
        console.log('👨‍🔧 Creando MECANICO...');
        const mecanico = await prisma.mecanico.upsert({
            where: { correoEmpresarial: 'mecanico@mecanic.com' },
            update: { contrasena: passwordHash, cuentaActiva: true },
            create: {
                nombres: 'Carlos',
                apellidos: 'Mecanico',
                edad: 35,
                anosExperiencia: 10,
                correo: 'carlos@gmail.com',
                correoEmpresarial: 'mecanico@mecanic.com',
                contrasena: passwordHash,
                especialidad: 'Reparación Motor',
                estadoLaboral: 'Disponible',
                cuentaActiva: true,
            },
        });
        console.log(`   ✅ Mecanico: ${mecanico.correoEmpresarial}`);

        // 3. PERSONAL FINANCIERO
        console.log('💰 Creando PERSONAL FINANCIERO...');
        const financiero = await prisma.personalFinanciero.upsert({
            where: { correoEmpresarial: 'finanzas@finanzasmecanic.com' },
            update: { contrasena: passwordHash, cuentaActiva: true },
            create: {
                nombres: 'María',
                apellidos: 'Financiero',
                correo: 'maria@gmail.com',
                correoEmpresarial: 'finanzas@finanzasmecanic.com',
                contrasena: passwordHash,
                cuentaActiva: true,
            },
        });
        console.log(`   ✅ Financiero: ${financiero.correoEmpresarial}`);

        // 4. PERSONAL INVENTARIO
        console.log('📦 Creando PERSONAL INVENTARIO...');
        const inventario = await prisma.personalInventario.upsert({
            where: { correoEmpresarial: 'inventario@inventariomecanic.com' },
            update: { contrasena: passwordHash, cuentaActiva: true },
            create: {
                nombres: 'Pedro',
                apellidos: 'Inventario',
                correo: 'pedro@gmail.com',
                correoEmpresarial: 'inventario@inventariomecanic.com',
                contrasena: passwordHash,
                cuentaActiva: true,
            },
        });
        console.log(`   ✅ Inventario: ${inventario.correoEmpresarial}`);

        // 5. CLIENTE
        console.log('👤 Creando CLIENTE...');
        const cliente = await prisma.cliente.upsert({
            where: { correo: 'cliente@gmail.com' },
            update: { contrasena: passwordHash, cuentaActiva: true },
            create: {
                nombres: 'Ana',
                segundoNombre: 'María',
                apellidos: 'Cliente',
                segundoApellido: 'González',
                fechaNacimiento: new Date('1990-05-15'),
                telefono: '+34 666 777 888',
                correo: 'cliente@gmail.com',
                contrasena: passwordHash,
                cuentaActiva: true,
            },
        });
        console.log(`   ✅ Cliente: ${cliente.correo}`);

        console.log('\n✅ ¡TODOS LOS USUARIOS CREADOS!\n');
        console.log('📋 DATOS DE PRUEBA PARA LOGIN:');
        console.log('═══════════════════════════════════════════════════');
        console.log(`\n🔐 ADMIN:`);
        console.log(`   Email: admin@mecanic.com`);
        console.log(`   Pass:  ${passwordPlain}`);
        console.log(`   Rol:   admin`);
        
        console.log(`\n👨‍🔧 MECANICO:`);
        console.log(`   Email: mecanico@mecanic.com`);
        console.log(`   Pass:  ${passwordPlain}`);
        console.log(`   Rol:   mecanico`);
        
        console.log(`\n💰 FINANCIERO:`);
        console.log(`   Email: finanzas@finanzasmecanic.com`);
        console.log(`   Pass:  ${passwordPlain}`);
        console.log(`   Rol:   financiero`);
        
        console.log(`\n📦 INVENTARIO:`);
        console.log(`   Email: inventario@inventariomecanic.com`);
        console.log(`   Pass:  ${passwordPlain}`);
        console.log(`   Rol:   inventario`);
        
        console.log(`\n👤 CLIENTE:`);
        console.log(`   Email: cliente@gmail.com`);
        console.log(`   Pass:  ${passwordPlain}`);
        console.log(`   Rol:   cliente`);
        console.log('\n═══════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
