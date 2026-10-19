import { Router } from 'express';
import {
  listarSolicitudes,
  crearSolicitud,
  actualizarSolicitud,
  eliminarSolicitud,
} from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET  /api/solicitudes/cliente/:correo  → cliente obtiene sus propias solicitudes (público)
router.get('/cliente/:correo', async (req, res) => {
  try {
    const { correo } = req.params;
    const correoNorm = correo.trim().toLowerCase();
    
    const solicitudes = await require('../lib/prisma').default.solicitud.findMany({
      where: { correoCliente: correoNorm },
      include: { 
        mecanico: { select: { id: true, nombres: true, apellidos: true } } 
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(solicitudes);
  } catch (err: any) {
    console.error('[listarSolicitudesCliente]', err?.message);
    res.status(500).json({ message: 'Error al obtener las solicitudes' });
  }
});

// GET  /api/solicitudes  → mecánico autenticado ve las solicitudes
router.get('/', authMiddleware, listarSolicitudes);

// POST /api/solicitudes  → cliente crea solicitud (público, sin token)
router.post('/', crearSolicitud);

// PUT  /api/solicitudes/:id  → mecánico actualiza estado/datos
router.put('/:id', authMiddleware, actualizarSolicitud);

// DELETE /api/solicitudes/:id  → mecánico autenticado puede eliminar solicitudes
router.delete('/:id', authMiddleware, eliminarSolicitud);

export default router;
