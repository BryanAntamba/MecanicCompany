import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import mecanicosRoutes from './routes/mecanicos.routes';
import clientesRoutes from './routes/clientes.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import mantenimientosRoutes from './routes/mantenimientos.routes';
import reportesRoutes from './routes/reportes.routes';
import reporteSoporteRoutes from './routes/reporteSoporte.routes';
import personalFinancieroRoutes from './routes/personalFinanciero.routes';
import personalInventarioRoutes from './routes/personalInventario.routes';
import productoRoutes from './routes/producto.routes';
import finanzasRoutes from './routes/finanzas.routes';

const app = express();

// ─── Seguridad: cabeceras HTTP ────────────────────────────────────────────────
// Helmet añade X-Content-Type-Options, X-Frame-Options, HSTS, etc.
app.use(helmet());

// ─── CORS — solo orígenes explícitamente permitidos ──────────────────────────
// En desarrollo aceptamos cualquier IP local de Expo Go; en producción
// reemplaza por la URL real de tu app.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Sin origen (curl / Postman / app nativa) → permitir en desarrollo
    if (!origin) return cb(null, true);
    // En desarrollo: permitir cualquier IP local (192.168.x.x / 10.x.x.x / 172.x.x.x) y localhost
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocal || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido → ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' })); // límite ampliado para base64 de fotos de perfil

// ─── Logger detallado: registrar TODOS los requests ─────────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const clientIp = req.ip || req.socket.remoteAddress || 'desconocido';
  console.error(`\n[${timestamp}] 📱 ${req.method} ${req.path}`);
  console.error(`   IP: ${clientIp}`);
  console.error(`   Body:`, JSON.stringify(req.body, null, 2));
  
  // Interceptar json() también
  const originalJson = res.json;
  res.json = function(data: any) {
    console.error(`   Response Status: ${res.statusCode}`);
    console.error(`   Response Body:`, JSON.stringify(data, null, 2));
    return originalJson.call(this, data);
  };
  
  next();
});

// ─── Archivos estáticos: fotos de mecánicos ───────────────────────────────────
// GET /uploads/mecanicos/:filename → sirve las fotos guardadas por multer
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth', clientesRoutes);  // Las rutas de auth de cliente van aquí
app.use('/api/admin', adminRoutes);
app.use('/api/mecanicos', mecanicosRoutes);
app.use('/api/personal-financiero', personalFinancieroRoutes);
app.use('/api/personal-inventario', personalInventarioRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/reportes-soporte', reporteSoporteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/finanzas', finanzasRoutes);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error handler global (debe ir ÚLTIMO, después de todas las rutas) ─────
// Captura cualquier error de async controllers que no tengan try/catch propio
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err?.message ?? err);
  res.status(err?.status ?? 500).json({ message: err?.message ?? 'Error interno del servidor' });
});

export default app;
