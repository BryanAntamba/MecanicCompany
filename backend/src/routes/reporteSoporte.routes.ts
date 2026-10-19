import { Router } from 'express';
import {
  crearReporteSoporte,
  listarReportes,
} from '../controllers/reporteSoporte.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/reportes-soporte - Cliente crea reporte (público, sin token)
router.post('/', crearReporteSoporte);

// GET /api/reportes-soporte - Admin lista todos los reportes (requiere autenticación)
router.get('/', authMiddleware, listarReportes);

export default router;
