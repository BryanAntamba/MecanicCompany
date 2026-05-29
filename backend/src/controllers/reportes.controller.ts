import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { enviarReporteEmail } from '../services/email.service';

// POST /api/reportes/enviar/:solicitudId
export async function enviarReporte(req: Request, res: Response): Promise<void> {
    try {
        const { solicitudId } = req.params;

        const solicitud = await prisma.solicitud.findUnique({
            where: { id: solicitudId },
            include: { mantenimiento: true, mecanico: true },
        });

        if (!solicitud) {
            res.status(404).json({ message: 'Solicitud no encontrada' });
            return;
        }

        if (!solicitud.mantenimiento) {
            res.status(400).json({ message: 'La solicitud aún no tiene registro de mantenimiento' });
            return;
        }

        await enviarReporteEmail(solicitud.correoCliente, solicitud, solicitud.mantenimiento);

        // Marca la solicitud como Completado al enviar el reporte
        await prisma.solicitud.update({
            where: { id: solicitudId },
            data: { estado: 'Completado' },
        });

        res.json({ message: `Reporte enviado correctamente a ${solicitud.correoCliente}` });
    } catch (err: any) {
        console.error('[enviarReporte]', err?.message ?? err);
        res.status(500).json({ message: err?.message ?? 'Error al enviar el reporte' });
    }
}
