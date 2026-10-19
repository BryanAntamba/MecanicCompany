import { Router } from 'express';
import {
  listarInventario,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
  cambiarEstadoInventario,
} from '../controllers/personalInventario.controller';
import { authMiddleware, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/personal-inventario - Listar todo el personal de inventario
router.get('/', authMiddleware, listarInventario);

// POST /api/personal-inventario - Crear nuevo personal de inventario (requiere ser admin)
router.post('/', authMiddleware, soloAdmin, crearInventario);

// PUT /api/personal-inventario/:id - Editar personal de inventario (requiere ser admin)
router.put('/:id', authMiddleware, soloAdmin, actualizarInventario);

// DELETE /api/personal-inventario/:id - Eliminar personal de inventario (requiere ser admin)
router.delete('/:id', authMiddleware, soloAdmin, eliminarInventario);

// PATCH /api/personal-inventario/:id/estado - Cambiar estado de cuenta
router.patch('/:id/estado', authMiddleware, soloAdmin, cambiarEstadoInventario);

export default router;
