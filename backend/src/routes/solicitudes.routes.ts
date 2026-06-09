import { Router } from 'express';
import {
  listarSolicitudes,
  crearSolicitud,
  actualizarSolicitud,
  eliminarSolicitud,
} from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET  /api/solicitudes  → mecánico autenticado ve las solicitudes
router.get('/', authMiddleware, listarSolicitudes);

// POST /api/solicitudes  → cliente crea solicitud (público, sin token)
router.post('/', crearSolicitud);

// PUT  /api/solicitudes/:id  → mecánico actualiza estado/datos
router.put('/:id', authMiddleware, actualizarSolicitud);

// DELETE /api/solicitudes/:id  → mecánico autenticado puede eliminar solicitudes
router.delete('/:id', authMiddleware, eliminarSolicitud);

export default router;
