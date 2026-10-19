import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  obtenerPagos,
  obtenerPagoPorId,
  crearPago,
  actualizarPago,
  eliminarPago,
  obtenerEstadisticas,
  obtenerEstadisticasPagados,
} from '../controllers/finanzas.controller';

const router = Router();

/**
 * RUTAS PÚBLICAS (sin autenticación)
 */

// GET - Obtener estadísticas financieras (DEBE ir antes de /:id)
router.get('/estadisticas/resumen', obtenerEstadisticas);

// GET - Obtener estadísticas de pagos realizados
router.get('/estadisticas/pagados', obtenerEstadisticasPagados);

// GET - Obtener todos los pagos (con filtros)
router.get('/', obtenerPagos);

// GET - Obtener un pago por ID
router.get('/:id', obtenerPagoPorId);

/**
 * RUTAS PROTEGIDAS (requieren token)
 */

// POST - Crear nuevo pago (factura automática)
router.post('/', authMiddleware, crearPago);

// PUT - Actualizar estado de pago (marcar como pagado)
router.put('/:id', authMiddleware, actualizarPago);

// DELETE - Eliminar un pago
router.delete('/:id', authMiddleware, eliminarPago);

export default router;
