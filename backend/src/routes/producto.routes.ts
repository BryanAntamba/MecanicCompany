// producto.routes.ts
// Rutas para gestión de productos en inventario

import { Router } from 'express';
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/producto.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas (requieren autenticación)
router.post('/', authMiddleware, crearProducto);
router.get('/', obtenerProductos); // Listar productos es público para clientes también
router.get('/:id', obtenerProductoPorId);
router.put('/:id', authMiddleware, actualizarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);

export default router;
