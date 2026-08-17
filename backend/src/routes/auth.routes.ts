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

const router = Router();

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

// POST /api/auth/enviar-codigo-cliente  → verificación de correo de clientes externos
router.post('/enviar-codigo-cliente', enviarCodigoCliente);

// POST /api/auth/verificar-codigo-cliente
router.post('/verificar-codigo-cliente', verificarCodigoCliente);

export default router;
