import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { enviarReporteEmail } from '../services/email.service';

// POST /api/mantenimientos
export async function crearMantenimiento(req: Request, res: Response): Promise<void> {
  const {
    solicitudId, marca, modelo, placa,
    mecanicoAsignado, diagnostico, trabajoRealizado, otroTrabajo,
    repuestosUtilizados, diagnosticoRealizado, observaciones,
    costoManoObra, costoRepuestos,
    fechaServicio, fechaInicio, fechaFinalizacion,
  } = req.body;

  // Obtiene la solicitud para acceder a los datos del cliente y enviar el correo
  const solicitud = await prisma.solicitud.findUnique({ where: { id: solicitudId } });
  if (!solicitud) {
    res.status(404).json({ message: 'Solicitud no encontrada' });
    return;
  }

  // Crea el mantenimiento y actualiza el estado de la solicitud a "En_proceso"
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

  // Envía el reporte al correo del cliente (sin bloquear la respuesta)
  enviarReporteEmail(solicitud.correoCliente, solicitud, mantenimiento).catch((err) => {
    console.error('[EMAIL] Error al enviar reporte de mantenimiento:', err);
  });

  res.status(201).json(mantenimiento);
}

// PUT /api/mantenimientos/:id
export async function actualizarMantenimiento(req: Request, res: Response): Promise<void> {
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

  // Si se indica un nuevo estado para la solicitud, lo actualiza también
  if (estadoSolicitud) {
    await prisma.solicitud.update({
      where: { id: mantenimiento.solicitudId },
      data: { estado: estadoSolicitud },
    });
  }

  res.json(mantenimiento);
}
