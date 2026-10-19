import { Router } from 'express';
import {
  crearMantenimiento,
  actualizarMantenimiento,
  obtenerHistorialMecanico,
} from '../controllers/mantenimientos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/mantenimientos  → mecánico registra mantenimiento para una solicitud
router.post('/', authMiddleware, crearMantenimiento);

// GET /api/mantenimientos/historial/mecanico → obtiene historial del mecánico logueado
router.get('/historial/mecanico', authMiddleware, obtenerHistorialMecanico);

// PUT  /api/mantenimientos/:id
router.put('/:id', authMiddleware, actualizarMantenimiento);

export default router;
