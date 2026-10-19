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
// El cliente ya debe estar verificado (cuentaActiva: true) en la tabla Cliente
// No requiere validación de código adicional
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
        // Verificar que el cliente existe y su cuenta está activa (verificada)
        const cliente = await prisma.cliente.findUnique({
            where: { correo: correoNorm },
        });

        if (!cliente) {
            res.status(404).json({ message: 'Cliente no encontrado' });
            return;
        }

        if (!cliente.cuentaActiva) {
            res.status(403).json({ message: 'La cuenta no ha sido verificada. Completa el registro primero.' });
            return;
        }

        // Crear solicitud (el cliente ya está verificado por cuentaActiva: true)
        const solicitud = await prisma.solicitud.create({
            data: {
                nombreCliente, telefono,
                correoCliente: correoNorm,
                marca, modelo,
                anio: String(anio),
                placa, kilometraje: String(kilometraje),
                tipoServicio, otroServicio: otroServicio ?? '',
                descripcionProblema, fechaCita, horaCita,
                provincia: provincia ?? '',
                ubicacionMecanicaId: ubicacionMecanicaId ?? '',
                ubicacionMecanicaNombre: ubicacionMecanicaNombre ?? '',
                ubicacionMecanicaDireccion: ubicacionMecanicaDireccion ?? '',
            },
        });

        console.error(`[crearSolicitud] ✅ Solicitud creada: ${solicitud.id}`);
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
