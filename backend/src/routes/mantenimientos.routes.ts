import { Router } from 'express';
import {
  crearMantenimiento,
  actualizarMantenimiento,
} from '../controllers/mantenimientos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/mantenimientos  → mecánico registra mantenimiento para una solicitud
router.post('/', authMiddleware, crearMantenimiento);

// PUT  /api/mantenimientos/:id
router.put('/:id', authMiddleware, actualizarMantenimiento);

export default router;
