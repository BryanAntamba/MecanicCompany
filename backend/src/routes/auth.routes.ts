import { Router } from 'express';
// import rateLimit from 'express-rate-limit'; // TODO: re-habilitar en producción
import {
  login,
  solicitarRecuperacion,
  reenviarCodigo,
  verificarEstadoReenvio,
  verificarCodigo,
  cambiarPassword,
  enviarCodigoCliente,
  verificarCodigoCliente,
} from '../controllers/auth.controller';
import {
  registroCliente,
  verificarCodigoCliente as verificarCodigoClienteNuevo,
  loginCliente,
  reenviarCodigoCliente,
} from '../controllers/clientes.controller';

const router = Router();

// ─── RUTAS DE ADMIN Y MECÁNICOS ───────────────────────────────────────────────

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/recuperar  → envía código al correo gmail del mecánico
router.post('/recuperar', solicitarRecuperacion);

// POST /api/auth/reenviar-codigo → reenvía el código (máximo 5 intentos)
router.post('/reenviar-codigo', reenviarCodigo);

// POST /api/auth/verificar-estado-reenvio → verifica si está bloqueado y tiempo restante
router.post('/verificar-estado-reenvio', verificarEstadoReenvio);

// POST /api/auth/verificar-codigo
router.post('/verificar-codigo', verificarCodigo);

// PUT /api/auth/cambiar-password
router.put('/cambiar-password', cambiarPassword);

// POST /api/auth/enviar-codigo-cliente  → verificación de correo de clientes externos (DEPRECATED)
router.post('/enviar-codigo-cliente', enviarCodigoCliente);

// POST /api/auth/verificar-codigo-cliente (DEPRECATED)
router.post('/verificar-codigo-cliente', verificarCodigoCliente);

// ─── RUTAS DE CLIENTES (NUEVAS) ───────────────────────────────────────────────

// POST /api/auth/cliente/registro — Registro de nuevo cliente
router.post('/cliente/registro', registroCliente);

// POST /api/auth/cliente/verificar-codigo — Verificar código de registro
router.post('/cliente/verificar-codigo', verificarCodigoClienteNuevo);

// POST /api/auth/cliente/login — Login de cliente (con Gmail)
router.post('/cliente/login', loginCliente);

// POST /api/auth/cliente/reenviar-codigo — Reenviar código de verificación
router.post('/cliente/reenviar-codigo', reenviarCodigoCliente);

export default router;
