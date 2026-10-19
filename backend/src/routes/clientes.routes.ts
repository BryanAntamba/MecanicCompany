import { Router } from 'express';
import {
  registroCliente,
  verificarCodigoCliente,
  loginCliente,
  reenviarCodigoCliente,
  cambiarContrasenaCliente,
  recuperarContrasenaCliente,
  listarClientes,
  actualizarCliente,
  eliminarCliente,
  cambiarEstadoCuentaCliente,
} from '../controllers/clientes.controller';
import { authMiddleware, soloAdmin } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/clientes — Listar todos los clientes
router.get('/', authMiddleware, listarClientes);

// PUT /api/clientes/:id — Editar cliente (requiere admin)
router.put('/:id', authMiddleware, soloAdmin, actualizarCliente);

// DELETE /api/clientes/:id — Eliminar cliente (requiere admin)
router.delete('/:id', authMiddleware, soloAdmin, eliminarCliente);

// PATCH /api/clientes/:id/estado — Cambiar estado de la cuenta (requiere admin)
router.patch('/:id/estado', authMiddleware, soloAdmin, cambiarEstadoCuentaCliente);

// POST /api/auth/cliente/registro — Registro de nuevo cliente
router.post('/cliente/registro', registroCliente);

// POST /api/auth/cliente/verificar-código — Verificar código de registro
router.post('/cliente/verificar-codigo', verificarCodigoCliente);

// POST /api/auth/cliente/login — Login de cliente (con Gmail)
router.post('/cliente/login', loginCliente);

// POST /api/auth/cliente/reenviar-código — Reenviar código de verificación
router.post('/cliente/reenviar-codigo', reenviarCodigoCliente);

// POST /api/auth/cliente/recuperar-contrasena — Solicitar código para recuperación de contraseña
router.post('/cliente/recuperar-contrasena', recuperarContrasenaCliente);

// POST /api/auth/cliente/cambiar-contrasena — Cambiar contraseña después de verificar código
router.post('/cliente/cambiar-contrasena', cambiarContrasenaCliente);

export default router;
