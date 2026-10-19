// Script one-time: asigna mecanicoId a las solicitudes Completadas que lo tienen null
// Asigna cada una al mecánico cuyo nombre coincide con mecanicoAsignado en el mantenimiento
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    // Busca solicitudes completadas sin mecanicoId asignado que tengan mantenimiento
    const sin = await p.solicitud.findMany({
        where: { estado: 'Completado', mecanicoId: null },
        include: { mantenimiento: true },
    });

    console.log(`Solicitudes Completadas sin mecanicoId: ${sin.length}`);

    const mecanicos = await p.mecanico.findMany({
        select: { id: true, nombres: true, apellidos: true },
    });

    let arregladas = 0;

    for (const s of sin) {
        const nombreAsignado = s.mantenimiento?.mecanicoAsignado?.trim().toLowerCase() ?? '';
        const match = mecanicos.find((m) => {
            const full = `${m.nombres} ${m.apellidos}`.trim().toLowerCase();
            return full === nombreAsignado || nombreAsignado.includes(m.nombres.toLowerCase());
        });

        if (match) {
            await p.solicitud.update({ where: { id: s.id }, data: { mecanicoId: match.id } });
            console.log(`✅ Solicitud ${s.id.slice(0, 8)} → mecanicoId=${match.id.slice(0, 8)} (${match.nombres} ${match.apellidos})`);
            arregladas++;
        } else {
            console.log(`⚠️  Solicitud ${s.id.slice(0, 8)} — no se encontró mecánico para "${s.mantenimiento?.mecanicoAsignado}"`);
            console.log('   Mecánicos disponibles:', mecanicos.map(m => `${m.nombres} ${m.apellidos}`).join(', '));
        }
    }

    console.log(`\nTotal arregladas: ${arregladas}/${sin.length}`);
}

main().catch(console.error).finally(() => p.$disconnect());
