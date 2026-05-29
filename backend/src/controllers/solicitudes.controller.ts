import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/solicitudes
export async function listarSolicitudes(_req: Request, res: Response): Promise<void> {
    const solicitudes = await prisma.solicitud.findMany({
        include: { mantenimiento: true, mecanico: { select: { id: true, nombres: true, apellidos: true } } },
        orderBy: { createdAt: 'desc' },
    });

    res.json(solicitudes);
}

// POST /api/solicitudes  (público — cliente envía solicitud)
// Requiere que el correo haya sido verificado previamente:
// debe existir un CodigoVerificacion válido (no usado, no expirado) para el correoCliente.
// El código se consume y la solicitud se crea en una sola transacción atómica.
export async function crearSolicitud(req: Request, res: Response): Promise<void> {
    const {
        nombreCliente, telefono, correoCliente,
        marca, modelo, anio, placa, kilometraje,
        tipoServicio, otroServicio, descripcionProblema,
        fechaCita, horaCita,
    } = req.body;

    if (!correoCliente) {
        res.status(400).json({ message: 'Correo del cliente requerido' });
        return;
    }

    const correoNorm = correoCliente.trim().toLowerCase();

    // Busca un código válido (no usado, no expirado) para este correo
    const codigoValido = await prisma.codigoVerificacion.findFirst({
        where: {
            correo: correoNorm,
            usado: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    });

    if (!codigoValido) {
        res.status(403).json({ message: 'El correo no ha sido verificado. Solicita un nuevo código.' });
        return;
    }

    // Transacción: consume el código y crea la solicitud de forma atómica
    const [solicitud] = await prisma.$transaction([
        prisma.solicitud.create({
            data: {
                nombreCliente, telefono,
                correoCliente: correoNorm,
                marca, modelo,
                anio: String(anio),
                placa, kilometraje: String(kilometraje),
                tipoServicio, otroServicio: otroServicio ?? '',
                descripcionProblema, fechaCita, horaCita,
            },
        }),
        prisma.codigoVerificacion.update({
            where: { id: codigoValido.id },
            data: { usado: true },
        }),
    ]);

    res.status(201).json(solicitud);
}

// PUT /api/solicitudes/:id
export async function actualizarSolicitud(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const {
            nombreCliente, telefono, correoCliente,
            marca, modelo, anio, placa, kilometraje,
            tipoServicio, otroServicio, descripcionProblema,
            fechaCita, horaCita, estado, mecanicoId,
        } = req.body;

        // Solo incluye mecanicoId en el update si fue enviado explícitamente
        const data: Record<string, unknown> = {
            nombreCliente, telefono, correoCliente,
            marca, modelo, anio, placa, kilometraje,
            tipoServicio, otroServicio, descripcionProblema,
            fechaCita, horaCita,
        };
        if (estado !== undefined) data.estado = estado;
        if (mecanicoId !== undefined) data.mecanicoId = mecanicoId || null;

        const solicitud = await prisma.solicitud.update({
            where: { id },
            data,
            include: { mantenimiento: true },
        });

        res.json(solicitud);
    } catch (err: any) {
        console.error('[actualizarSolicitud]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al actualizar la solicitud' });
    }
}

// DELETE /api/solicitudes/:id
export async function eliminarSolicitud(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await prisma.solicitud.delete({ where: { id } });
        res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (err: any) {
        console.error('[eliminarSolicitud]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al eliminar la solicitud' });
    }
}
