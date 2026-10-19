import { Router } from 'express';
import {
  listarFinanciero,
  crearFinanciero,
  actualizarFinanciero,
  eliminarFinanciero,
  cambiarEstadoFinanciero,
} from '../controllers/personalFinanciero.controller';
import { authMiddleware, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/personal-financiero - Listar todo el personal financiero
router.get('/', authMiddleware, listarFinanciero);

// POST /api/personal-financiero - Crear nuevo personal financiero (requiere ser admin)
router.post('/', authMiddleware, soloAdmin, crearFinanciero);

// PUT /api/personal-financiero/:id - Editar personal financiero (requiere ser admin)
router.put('/:id', authMiddleware, soloAdmin, actualizarFinanciero);

// DELETE /api/personal-financiero/:id - Eliminar personal financiero (requiere ser admin)
router.delete('/:id', authMiddleware, soloAdmin, eliminarFinanciero);

// PATCH /api/personal-financiero/:id/estado - Cambiar estado de cuenta
router.patch('/:id/estado', authMiddleware, soloAdmin, cambiarEstadoFinanciero);

export default router;
