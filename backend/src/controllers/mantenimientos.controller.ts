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
      fotoVehiculo,
    } = req.body;

    console.log('[crearMantenimiento] 📝 Creando mantenimiento para solicitud:', solicitudId);
    console.log('[crearMantenimiento] ¿Tiene foto?', !!fotoVehiculo);
    console.log('[crearMantenimiento] Tamaño foto:', fotoVehiculo?.length || 0);

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
      fotoVehiculo: fotoVehiculo || null,
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

    console.log('[crearMantenimiento] ✅ Mantenimiento guardado con ID:', mantenimiento.id);
    console.log('[crearMantenimiento] ✅ Foto guardada:', !!mantenimiento.fotoVehiculo);

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

// GET /api/mantenimientos/historial/mecanico
// Obtiene todos los mantenimientos completados del mecánico logueado
export async function obtenerHistorialMecanico(req: Request, res: Response): Promise<void> {
  try {
    const mecanicoId = req.user!.id;
    console.log('[obtenerHistorialMecanico] Cargando historial para mecánico:', mecanicoId);

    const solicitudes = await prisma.solicitud.findMany({
      where: {
        mecanicoId,
        estado: 'Completado',
        mantenimiento: {
          isNot: null,
        },
      },
      include: {
        mantenimiento: true,
        mecanico: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log('[obtenerHistorialMecanico] Solicitudes encontradas:', solicitudes.length);

    const registros = solicitudes.map((s) => {
      console.log(`[obtenerHistorialMecanico] Procesando solicitud ${s.id} - Placa: ${s.placa}`);
      console.log(`[obtenerHistorialMecanico]   ¿Tiene foto?: ${!!s.mantenimiento?.fotoVehiculo}`);
      console.log(`[obtenerHistorialMecanico]   Longitud foto: ${s.mantenimiento?.fotoVehiculo?.length || 0}`);

      // Parsear repuestos si es un JSON string
      let repuestosSeleccionados: any[] = [];
      try {
        if (s.mantenimiento?.repuestosUtilizados) {
          const parsed = JSON.parse(s.mantenimiento.repuestosUtilizados);
          repuestosSeleccionados = Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) {
        console.log('[obtenerHistorialMecanico] No se pudo parsear repuestos:', e);
        repuestosSeleccionados = [];
      }

      // Calcular costo total
      const costoManoObra = parseFloat(s.mantenimiento?.costoManoObra.toString() || '0');
      const costoRepuestos = parseFloat(s.mantenimiento?.costoRepuestos.toString() || '0');
      const costoTotal = costoManoObra + costoRepuestos;

      return {
        id: s.id,
        clienteNombre: s.nombreCliente,
        clienteCorreo: s.correoCliente,
        telefono: s.telefono || 'No especificado',
        marca: s.marca,
        modelo: s.modelo,
        placa: s.placa,
        fechaMantenimiento: s.mantenimiento?.fechaFinalizacion || s.updatedAt.toISOString().split('T')[0],
        mecanicoNombre: s.mecanico ? `${s.mecanico.nombres} ${s.mecanico.apellidos}` : s.mantenimiento?.mecanicoAsignado || 'No asignado',
        mantenimiento: {
          marca: s.mantenimiento?.marca || '',
          modelo: s.mantenimiento?.modelo || '',
          placa: s.mantenimiento?.placa || '',
          año: s.anio || '',
          kilometraje: s.kilometraje || '',
          fechaServicio: s.mantenimiento?.fechaServicio || '',
          fechaGeneracionReporte: s.mantenimiento?.createdAt ? s.mantenimiento.createdAt.toISOString().split('T')[0] : 'N/A',
          mecanicoAsignado: s.mecanico ? `${s.mecanico.nombres} ${s.mecanico.apellidos}` : s.mantenimiento?.mecanicoAsignado || '',
          diagnostico: s.mantenimiento?.diagnostico || '',
          trabajoRealizado: s.mantenimiento?.trabajoRealizado || '',
          otroTrabajo: s.mantenimiento?.otroTrabajo || '',
          repuestosUtilizados: s.mantenimiento?.repuestosUtilizados || '',
          repuestosSeleccionados: repuestosSeleccionados,
          diagnosticoRealizado: s.mantenimiento?.diagnosticoRealizado || '',
          costoManoObra: costoManoObra,
          costoRepuestos: costoRepuestos,
          costoTotal: costoTotal,
          observaciones: s.mantenimiento?.observaciones || '',
          fechaInicio: s.mantenimiento?.fechaInicio || '',
          fechaFinalizacion: s.mantenimiento?.fechaFinalizacion || '',
          fotoVehiculo: s.mantenimiento?.fotoVehiculo || null,
        },
      };
    });

    console.log('[obtenerHistorialMecanico] ✅ Historial enviado correctamente con', registros.length, 'registros');

    res.json({
      message: 'Historial obtenido correctamente',
      historial: registros,
    });
  } catch (err: any) {
    console.error('[obtenerHistorialMecanico]', err?.message);
    res.status(500).json({ message: err?.message ?? 'Error al obtener el historial' });
  }
}
