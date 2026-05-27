import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import mecanicosRoutes from './routes/mecanicos.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import mantenimientosRoutes from './routes/mantenimientos.routes';
import reportesRoutes from './routes/reportes.routes';

const app = express();

// ─── Middlewares globales ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

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

export default app;
