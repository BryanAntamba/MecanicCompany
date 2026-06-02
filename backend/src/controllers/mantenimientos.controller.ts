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

    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solicitudId },
      include: { mecanico: true },
    });
    if (!solicitud) {
      res.status(404).json({ message: 'Solicitud no encontrada' });
      return;
    }

    const mantenimientoData = {
      solicitudId, marca, modelo, placa,
      mecanicoAsignado, diagnostico, trabajoRealizado,
      otroTrabajo: otroTrabajo ?? '',
      repuestosUtilizados, diagnosticoRealizado, observaciones,
      costoManoObra, costoRepuestos,
      fechaServicio, fechaInicio, fechaFinalizacion,
    };

    const mecanicoId = req.user!.id;

    const [mantenimiento] = await prisma.$transaction([
      // upsert: crea si no existe, actualiza si ya existe (evita unique constraint)
      prisma.mantenimiento.upsert({
        where: { solicitudId },
        create: mantenimientoData,
        update: mantenimientoData,
      }),
      // Asigna el mecánico que guardó el mantenimiento y marca En_proceso
      prisma.solicitud.update({
        where: { id: solicitudId },
        data: { estado: 'En_proceso', mecanicoId },
      }),
    ]);

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
