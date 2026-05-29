import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { enviarReporteEmail } from '../services/email.service';

// POST /api/mantenimientos
export async function crearMantenimiento(req: Request, res: Response): Promise<void> {
  try {
    const {
      solicitudId, marca, modelo, placa,
      mecanicoAsignado, diagnostico, trabajoRealizado, otroTrabajo,
      repuestosUtilizados, diagnosticoRealizado, observaciones,
      costoManoObra, costoRepuestos,
      fechaServicio, fechaInicio, fechaFinalizacion,
    } = req.body;

    const solicitud = await prisma.solicitud.findUnique({ where: { id: solicitudId } });
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    const [mantenimiento] = await prisma.$transaction([
      prisma.mantenimiento.create({
        data: {
          solicitudId, marca, modelo, placa,
          mecanicoAsignado, diagnostico, trabajoRealizado,
          otroTrabajo: otroTrabajo ?? '',
          repuestosUtilizados, diagnosticoRealizado, observaciones,
          costoManoObra, costoRepuestos,
          fechaServicio, fechaInicio, fechaFinalizacion,
        },
      }),
      prisma.solicitud.update({
        where: { id: solicitudId },
        data: { estado: 'En_proceso' },
      }),
    ]);

    enviarReporteEmail(solicitud.correoCliente, solicitud, mantenimiento).catch((err) => {
      console.error('[EMAIL] Error al enviar reporte de mantenimiento:', err);
    });

    res.status(201).json(mantenimiento);
  } catch (err: any) {
    console.error('[crearMantenimiento]', err?.message);
    res.status(500).json({ message: err?.message ?? 'Error al crear el mantenimiento' });
  }
}

// PUT /api/mantenimientos/:id
export async function actualizarMantenimiento(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      marca, modelo, placa,
      mecanicoAsignado, diagnostico, trabajoRealizado, otroTrabajo,
      repuestosUtilizados, diagnosticoRealizado, observaciones,
      costoManoObra, costoRepuestos,
      fechaServicio, fechaInicio, fechaFinalizacion,
      estadoSolicitud,
    } = req.body;

    const mantenimiento = await prisma.mantenimiento.update({
      where: { id },
      data: {
        marca, modelo, placa,
        mecanicoAsignado, diagnostico, trabajoRealizado,
        otroTrabajo: otroTrabajo ?? '',
        repuestosUtilizados, diagnosticoRealizado, observaciones,
        costoManoObra, costoRepuestos,
        fechaServicio, fechaInicio, fechaFinalizacion,
      },
      include: { solicitud: true },
    });

    if (estadoSolicitud) {
      await prisma.solicitud.update({
        where: { id: mantenimiento.solicitudId },
        data: { estado: estadoSolicitud },
      });
    }

    res.json(mantenimiento);
  } catch (err: any) {
    console.error('[actualizarMantenimiento]', err?.message);
    res.status(500).json({ message: err?.message ?? 'Error al actualizar el mantenimiento' });
  }
}
