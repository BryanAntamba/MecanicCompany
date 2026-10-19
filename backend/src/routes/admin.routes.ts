import { Router } from 'express';
import {
  registroAdmin,
  listarAdmins,
  actualizarAdmin,
  eliminarAdmin,
  cambiarEstadoAdmin,
} from '../controllers/admin.controller';
import { authMiddleware, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/admin - Registrar nuevo administrador (requiere ser admin)
router.post('/', authMiddleware, soloAdmin, registroAdmin);

// GET /api/admin - Listar todos los administradores (requiere autenticación)
router.get('/', authMiddleware, listarAdmins);

// PUT /api/admin/:id - Editar administrador (requiere ser admin)
router.put('/:id', authMiddleware, soloAdmin, actualizarAdmin);

// DELETE /api/admin/:id - Eliminar administrador (requiere ser admin)
router.delete('/:id', authMiddleware, soloAdmin, eliminarAdmin);

// PATCH /api/admin/:id/estado - Cambiar estado de cuenta (requiere ser admin)
router.patch('/:id/estado', authMiddleware, soloAdmin, cambiarEstadoAdmin);

export default router;
