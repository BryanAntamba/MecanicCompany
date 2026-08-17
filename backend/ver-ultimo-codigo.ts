// Script para ver el último código de verificación generado
// Uso: npx ts-node ver-ultimo-codigo.ts <correo>

import prisma from './src/lib/prisma';

const correo = process.argv[2];

if (!correo) {
  console.error('❌ Error: Debes proporcionar un correo');
  console.log('');
  console.log('Uso: npx ts-node ver-ultimo-codigo.ts correo@gmail.com');
  process.exit(1);
}

async function verCodigo() {
  try {
    const codigos = await prisma.codigoVerificacion.findMany({
      where: { correo: correo.trim().toLowerCase() },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (codigos.length === 0) {
      console.log('');
      console.log('❌ No hay códigos generados para:', correo);
      console.log('');
      return;
    }

    const codigo = codigos[0];
    const ahora = new Date();
    const expirado = ahora > codigo.expiresAt;

    console.log('');
    console.log('📧 Último código para:', correo);
    console.log('════════════════════════════════════════');
    console.log('');
    console.log('  Código:', codigo.codigo);
    console.log('  Generado:', codigo.createdAt.toLocaleString('es-ES'));
    console.log('  Expira:', codigo.expiresAt.toLocaleString('es-ES'));
    console.log('  Usado:', codigo.usado ? 'Sí' : 'No');
    console.log('  Estado:', expirado ? '❌ EXPIRADO' : '✅ VÁLIDO');
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('');

    if (expirado) {
      console.log('⚠️  Este código ya expiró. Solicita uno nuevo desde la app.');
      console.log('');
    } else if (codigo.usado) {
      console.log('⚠️  Este código ya fue usado. Solicita uno nuevo desde la app.');
      console.log('');
    } else {
      console.log('✅ Puedes usar este código en la app ahora.');
      console.log('');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

verCodigo();
