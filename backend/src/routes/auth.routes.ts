import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  solicitarRecuperacion,
  verificarCodigo,
  cambiarPassword,
  enviarCodigoCliente,
  verificarCodigoCliente,
} from '../controllers/auth.controller';

const router = Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────
// Login: máx 10 intentos por IP en 15 min → evita fuerza bruta de contraseñas
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Recuperación y verificación: máx 5 por IP en 15 min → evita enumeración de correos
const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiadas solicitudes de recuperación. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login
router.post('/login', loginLimiter, login);

// POST /api/auth/recuperar  → envía código al correo gmail del mecánico
router.post('/recuperar', recoveryLimiter, solicitarRecuperacion);

// POST /api/auth/verificar-codigo
router.post('/verificar-codigo', recoveryLimiter, verificarCodigo);

// PUT /api/auth/cambiar-password
router.put('/cambiar-password', recoveryLimiter, cambiarPassword);

// POST /api/auth/enviar-codigo-cliente  → verificación de correo de clientes externos
router.post('/enviar-codigo-cliente', recoveryLimiter, enviarCodigoCliente);

// POST /api/auth/verificar-codigo-cliente
router.post('/verificar-codigo-cliente', recoveryLimiter, verificarCodigoCliente);

export default router;
