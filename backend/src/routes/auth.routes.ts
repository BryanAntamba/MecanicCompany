import { Router } from 'express';
import {
  login,
  solicitarRecuperacion,
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

// POST /api/auth/verificar-codigo
router.post('/verificar-codigo', verificarCodigo);

// PUT /api/auth/cambiar-password
router.put('/cambiar-password', cambiarPassword);

// POST /api/auth/enviar-codigo-cliente  → verificación de correo de clientes externos
router.post('/enviar-codigo-cliente', enviarCodigoCliente);

// POST /api/auth/verificar-codigo-cliente
router.post('/verificar-codigo-cliente', verificarCodigoCliente);

export default router;
