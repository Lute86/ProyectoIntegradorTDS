import { Router } from 'express';
import authRoutes from './auth.routes.js';
import carreraRoutes from './carrera.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/carreras', carreraRoutes);

export default router;
