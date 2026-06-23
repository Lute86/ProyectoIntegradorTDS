import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import logger from './utils/logger.js';
import models from './models/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './utils/response.js';
import routes from './routes/index.js';

const app = express();

// ── Trust proxy (solo producción, detrás de nginx) ──────────────────────
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ── Seguridad y utilidades ──────────────────────────────────────────────
//app.use(helmet());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── CORS ──────────────────────────────────────────────────────────────────
const corsOrigin = process.env.FRONTEND_URL;
if (process.env.NODE_ENV === 'production' && !corsOrigin) {
  logger.warn('FRONTEND_URL no está definido — CORS bloqueará todas las solicitudes');
}
app.use(cors({
  origin: corsOrigin || (process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'),
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }));
}

// ── Body parsing ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Archivos estáticos (uploads) ───────────────────────────────────────
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// ── Health check ────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await models.sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected', env: process.env.NODE_ENV });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected', env: process.env.NODE_ENV });
  }
});

// ── Rutas ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  notFound(res, 'Ruta no encontrada');
});

// ── Error handler global ────────────────────────────────────────────────
app.use(errorHandler);

export default app;
