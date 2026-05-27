import { Router } from 'express';
import { enviarReporte } from '../controllers/reportes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/reportes/enviar/:solicitudId  → envía reporte por email al cliente
router.post('/enviar/:solicitudId', authMiddleware, enviarReporte);

export default router;
