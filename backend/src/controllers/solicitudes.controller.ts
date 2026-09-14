import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/solicitudes
export async function listarSolicitudes(_req: Request, res: Response): Promise<void> {
    try {
        const solicitudes = await prisma.solicitud.findMany({
            include: { mantenimiento: true, mecanico: { select: { id: true, nombres: true, apellidos: true } } },
            orderBy: { createdAt: 'desc' },
        });

        res.json(solicitudes);
    } catch (err: any) {
        console.error('[listarSolicitudes]', err?.message);
        res.status(500).json({ message: 'Error al obtener las solicitudes' });
    }
}

// POST /api/solicitudes  (público — cliente envía solicitud)
// Para usuarios no autenticados (clientes públicos), se crea la solicitud directamente.
// Para usuarios autenticados, se requiere verificación de correo.
export async function crearSolicitud(req: Request, res: Response): Promise<void> {
    const {
        nombreCliente, telefono, correoCliente,
        marca, modelo, anio, placa, kilometraje,
        tipoServicio, otroServicio, descripcionProblema,
        fechaCita, horaCita,
        provincia, ubicacionMecanicaId, ubicacionMecanicaNombre, ubicacionMecanicaDireccion,
    } = req.body;

    if (!correoCliente) {
        res.status(400).json({ message: 'Correo del cliente requerido' });
        return;
    }

    const correoNorm = correoCliente.trim().toLowerCase();

    try {
        // Crear solicitud directamente (sin verificación de código)
        // La verificación de correo es opcional para clientes públicos
        const solicitud = await prisma.solicitud.create({
            data: {
                nombreCliente, 
                telefono: telefono || '',
                correoCliente: correoNorm,
                marca, 
                modelo,
                anio: String(anio),
                placa, 
                kilometraje: String(kilometraje),
                tipoServicio, 
                otroServicio: otroServicio ?? '',
                descripcionProblema, 
                fechaCita, 
                horaCita,
                provincia: provincia || '',
                ubicacionMecanicaId: ubicacionMecanicaId || '',
                ubicacionMecanicaNombre: ubicacionMecanicaNombre || '',
                ubicacionMecanicaDireccion: ubicacionMecanicaDireccion || '',
            },
        });

        res.status(201).json(solicitud);
    } catch (err: any) {
        console.error('[crearSolicitud]', err?.message);
        res.status(500).json({ message: err?.message ?? 'Error al crear la solicitud' });
    }
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
