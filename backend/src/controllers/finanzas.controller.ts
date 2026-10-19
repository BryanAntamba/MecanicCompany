import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Helper: Convertir Decimal de Prisma a números
 */
const convertirFinanzasANumeros = (pago: any) => {
  if (!pago) return pago;
  return {
    ...pago,
    costoManoObra: pago.costoManoObra ? Number(pago.costoManoObra) : 0,
    costoRepuestos: pago.costoRepuestos ? Number(pago.costoRepuestos) : 0,
    total: pago.total ? Number(pago.total) : 0,
  };
};

/**
 * Helper: Convertir array de pagos
 */
const convertirArrayFinanzas = (pagos: any[]) => {
  return pagos.map(convertirFinanzasANumeros);
};

/**
 * OBTENER TODOS LOS PAGOS (con filtros opcionales)
 * GET /api/finanzas
 * Query params: estado (Pendiente|Pagado), clienteNombre, fechaDesde, fechaHasta
 */
export const obtenerPagos = async (req: Request, res: Response) => {
  try {
    const { estado, clienteNombre, fechaDesde, fechaHasta } = req.query;

    let where: any = {};

    if (estado) {
      where.estado = estado as string;
    }

    if (clienteNombre) {
      where.clienteNombre = {
        contains: clienteNombre as string,
        mode: 'insensitive',
      };
    }

    if (fechaDesde) {
      where.fechaFactura = {
        gte: new Date(fechaDesde as string),
      };
    }

    if (fechaHasta) {
      where.fechaFactura = {
        ...where.fechaFactura,
        lte: new Date(fechaHasta as string),
      };
    }

    const pagos = await prisma.finanzas.findMany({
      where,
      orderBy: {
        fechaFactura: 'desc',
      },
    });

    const cantidad = pagos.length;
    const pagosConvertidos = convertirArrayFinanzas(pagos);

    res.status(200).json({
      message: 'Pagos obtenidos correctamente',
      cantidad,
      pagos: pagosConvertidos,
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al obtener pagos:', error);
    res.status(500).json({
      message: 'Error al obtener pagos',
      details: error.message,
    });
  }
};

/**
 * OBTENER UN PAGO POR ID
 * GET /api/finanzas/:id
 */
export const obtenerPagoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pago = await prisma.finanzas.findUnique({
      where: { id },
    });

    if (!pago) {
      return res.status(404).json({
        message: 'Pago no encontrado',
      });
    }

    const pagoConvertido = convertirFinanzasANumeros(pago);

    res.status(200).json({
      message: 'Pago obtenido correctamente',
      pago: pagoConvertido,
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al obtener pago:', error);
    res.status(500).json({
      message: 'Error al obtener pago',
      details: error.message,
    });
  }
};

/**
 * CREAR UN NUEVO PAGO (factura automática)
 * POST /api/finanzas
 * Requiere: mantenimientoId + datos del cliente/vehículo
 */
export const crearPago = async (req: Request, res: Response) => {
  try {
    const {
      mantenimientoId,
      clienteNombre,
      clienteTelefono,
      clienteCorreo,
      vehiculo,
      marca,
      modelo,
      placa,
      anio,
      kilometraje,
      servicio,
      mecanico,
      costoManoObra,
      costoRepuestos,
    } = req.body;

    // Validaciones
    if (!mantenimientoId || !clienteNombre || !servicio) {
      return res.status(400).json({
        message: 'Faltan campos requeridos',
        details: 'mantenimientoId, clienteNombre, servicio son obligatorios',
      });
    }

    // TODO: Cuando tengamos mantenimientos en BD, validar que exista
    // Por ahora permitimos crear finanzas sin validar mantenimiento

    // Verificar que no exista un pago para este mantenimiento
    const pagoExistente = await prisma.finanzas.findFirst({
      where: { mantenimientoId },
    });

    if (pagoExistente) {
      return res.status(409).json({
        message: 'Ya existe un pago para este mantenimiento',
      });
    }

    // Calcular total
    const costoManoObraNum = parseFloat(costoManoObra) || 0;
    const costoRepuestosNum = parseFloat(costoRepuestos) || 0;
    const total = costoManoObraNum + costoRepuestosNum;

    console.log('[finanzas.controller] 📊 Costos recibidos:');
    console.log('  - costoManoObra (input):', costoManoObra);
    console.log('  - costoManoObra (parsed):', costoManoObraNum);
    console.log('  - costoRepuestos (input):', costoRepuestos);
    console.log('  - costoRepuestos (parsed):', costoRepuestosNum);
    console.log('  - total (calculado):', total);

    // Generar número de factura
    const numeroFactura = `FAC-${Date.now()}`;

    // Crear pago
    const nuevoPago = await prisma.finanzas.create({
      data: {
        numeroFactura,
        mantenimientoId,
        clienteNombre,
        clienteTelefono,
        clienteCorreo,
        vehiculo,
        marca,
        modelo,
        placa,
        anio,
        kilometraje,
        servicio,
        mecanico,
        costoManoObra: costoManoObraNum,
        costoRepuestos: costoRepuestosNum,
        total,
        estado: 'Pendiente',
      },
    });

    console.log('[finanzas.controller] ✅ Pago creado:', nuevoPago.id);
    console.log('[finanzas.controller] 💾 Datos guardados en BD:');
    console.log('  - costoManoObra (BD):', nuevoPago.costoManoObra);
    console.log('  - costoRepuestos (BD):', nuevoPago.costoRepuestos);
    console.log('  - total (BD):', nuevoPago.total);
    console.log('  - numeroFactura:', nuevoPago.numeroFactura);

    const pagoConvertido = convertirFinanzasANumeros(nuevoPago);

    res.status(201).json({
      message: 'Pago creado correctamente',
      pago: pagoConvertido,
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al crear pago:', error);
    res.status(500).json({
      message: 'Error al crear pago',
      details: error.message,
    });
  }
};

/**
 * ACTUALIZAR ESTADO DE UN PAGO (marcar como pagado)
 * PUT /api/finanzas/:id
 */
export const actualizarPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, metodoPago, fechaPago, observacion, comprobanteUri } = req.body;

    // Validar que el pago existe
    const pagoExistente = await prisma.finanzas.findUnique({
      where: { id },
    });

    if (!pagoExistente) {
      return res.status(404).json({
        message: 'Pago no encontrado',
      });
    }

    // Parsear fecha si viene en formato DD/MM/YYYY
    let fechaPagoDate: Date | undefined;
    if (fechaPago) {
      if (typeof fechaPago === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(fechaPago)) {
        // Parsear formato DD/MM/YYYY
        const [dia, mes, año] = fechaPago.split('/').map(Number);
        fechaPagoDate = new Date(año, mes - 1, dia);
      } else {
        // Intentar parsear como ISO o timestamp
        fechaPagoDate = new Date(fechaPago);
      }
      
      // Validar que la fecha sea válida
      if (isNaN(fechaPagoDate.getTime())) {
        return res.status(400).json({
          message: 'Fecha de pago inválida. Formato esperado: DD/MM/YYYY',
        });
      }
    }

    // Actualizar pago
    const pagoActualizado = await prisma.finanzas.update({
      where: { id },
      data: {
        ...(estado && { estado }),
        ...(metodoPago && { metodoPago }),
        ...(fechaPagoDate && { fechaPago: fechaPagoDate }),
        ...(observacion !== undefined && { observacion }),
        ...(comprobanteUri !== undefined && { comprobanteUri }),
      },
    });

    console.log('[finanzas.controller] ✅ Pago actualizado:', pagoActualizado.id);
    console.log('[finanzas.controller] ✅ Nuevo estado:', pagoActualizado.estado);
    console.log('[finanzas.controller] ✅ Datos actualizados:', {
      estado: pagoActualizado.estado,
      metodoPago: pagoActualizado.metodoPago,
      fechaPago: pagoActualizado.fechaPago,
    });

    const pagoConvertido = convertirFinanzasANumeros(pagoActualizado);

    res.status(200).json({
      message: 'Pago actualizado correctamente',
      pago: pagoConvertido,
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al actualizar pago:', error);
    res.status(500).json({
      message: 'Error al actualizar pago',
      details: error.message,
    });
  }
};

/**
 * ELIMINAR UN PAGO
 * DELETE /api/finanzas/:id
 */
export const eliminarPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar que el pago existe
    const pagoExistente = await prisma.finanzas.findUnique({
      where: { id },
    });

    if (!pagoExistente) {
      return res.status(404).json({
        message: 'Pago no encontrado',
      });
    }

    // Eliminar pago
    const pagoEliminado = await prisma.finanzas.delete({
      where: { id },
    });

    console.log('[finanzas.controller] ✅ Pago eliminado:', pagoEliminado.id);

    const pagoConvertido = convertirFinanzasANumeros(pagoEliminado);

    res.status(200).json({
      message: 'Pago eliminado correctamente',
      pago: pagoConvertido,
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al eliminar pago:', error);
    res.status(500).json({
      message: 'Error al eliminar pago',
      details: error.message,
    });
  }
};

/**
 * OBTENER ESTADÍSTICAS FINANCIERAS
 * GET /api/finanzas/estadisticas/resumen
 */
export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    // Total de ingresos (pagos realizados)
    const ingresosMes = await prisma.finanzas.aggregate({
      where: {
        estado: 'Pagado',
        fechaPago: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      _sum: {
        total: true,
      },
    });

    // Total de costos en repuestos (este mes)
    const costoRepuestosMes = await prisma.finanzas.aggregate({
      where: {
        estado: 'Pagado',
        fechaPago: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
      _sum: {
        costoRepuestos: true,
      },
    });

    // Servicios completados este mes
    const serviciosCompletados = await prisma.finanzas.count({
      where: {
        estado: 'Pagado',
        fechaPago: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    // Servicios pendientes
    const serviciosPendientes = await prisma.finanzas.count({
      where: {
        estado: 'Pendiente',
      },
    });

    // Utilidad neta
    const totalIngresos = ingresosMes._sum.total || 0;
    const totalCostos = costoRepuestosMes._sum.costoRepuestos || 0;
    const utilidadNeta = Number(totalIngresos) - Number(totalCostos);

    res.status(200).json({
      message: 'Estadísticas obtenidas correctamente',
      estadisticas: {
        ingresosMes: Number(totalIngresos),
        costoRepuestosMes: Number(totalCostos),
        utilidadNeta,
        serviciosCompletados,
        serviciosPendientes,
      },
    });
  } catch (error: any) {
    console.error('[finanzas.controller] Error al obtener estadísticas:', error);
    res.status(500).json({
      message: 'Error al obtener estadísticas',
      details: error.message,
    });
  }
};

/**
 * OBTENER ESTADÍSTICAS DE PAGOS REALIZADOS
 * GET /api/finanzas/estadisticas/pagados
 */
export const obtenerEstadisticasPagados = async (req: Request, res: Response) => {
  try {
    console.log('[obtenerEstadisticasPagados] 🔍 Buscando pagos con estado Pagado...');

    // Total de pagos realizados (todos los tiempos)
    const pagosPagados = await prisma.finanzas.aggregate({
      where: {
        estado: 'Pagado',
      },
      _sum: {
        total: true,
      },
    });

    // Número de servicios realizados
    const numeroPagosRealizados = await prisma.finanzas.count({
      where: {
        estado: 'Pagado',
      },
    });

    console.log('[obtenerEstadisticasPagados] ✅ Pagos encontrados:', numeroPagosRealizados);
    console.log('[obtenerEstadisticasPagados] ✅ Total cancelado:', pagosPagados._sum.total);

    const totalCancelado = Number(pagosPagados._sum.total || 0);

    res.status(200).json({
      message: 'Estadísticas de pagos realizados obtenidas correctamente',
      pagosRealizados: {
        numeroPagos: numeroPagosRealizados,
        totalCancelado,
      },
    });
  } catch (error: any) {
    console.error('[obtenerEstadisticasPagados] ❌ Error:', error);
    res.status(500).json({
      message: 'Error al obtener estadísticas de pagados',
      details: error.message,
    });
  }
};
