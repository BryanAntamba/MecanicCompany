import { Router } from 'express';
import {
  listarMecanicos,
  crearMecanico,
  actualizarMecanico,
  eliminarMecanico,
  cambiarEstadoCuenta,
} from '../controllers/mecanicos.controller';
import { authMiddleware, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/mecanicos → cualquier mecánico autenticado puede listar
router.get('/', authMiddleware, listarMecanicos);

// Las siguientes rutas requieren ser admin
// POST /api/mecanicos
router.post('/', authMiddleware, soloAdmin, crearMecanico);

// PUT /api/mecanicos/:id
router.put('/:id', authMiddleware, soloAdmin, actualizarMecanico);

// DELETE /api/mecanicos/:id
router.delete('/:id', authMiddleware, soloAdmin, eliminarMecanico);

// PATCH /api/mecanicos/:id/estado  → activa/desactiva cuenta
router.patch('/:id/estado', authMiddleware, soloAdmin, cambiarEstadoCuenta);

export default router;
