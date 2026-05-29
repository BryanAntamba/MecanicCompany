import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import mecanicosRoutes from './routes/mecanicos.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import mantenimientosRoutes from './routes/mantenimientos.routes';
import reportesRoutes from './routes/reportes.routes';

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
    // Origen en la lista blanca o IP local (192.168.x.x / 10.x.x.x)
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocal || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen no permitido → ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50kb' })); // límite de payload para evitar DoS

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/mecanicos', mecanicosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/reportes', reportesRoutes);

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
