import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './utils/response.js';
import routes from './routes/index.js';

const app = express();

// ── Seguridad y utilidades ──────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));

// ── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Body parsing ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Archivos estáticos (uploads) ───────────────────────────────────────
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// ── Health check ────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
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
