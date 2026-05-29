import { Router } from 'express';
import authRoutes from './auth.routes.js';
import carreraRoutes from './carrera.routes.js';
import materiaRoutes from './materia.routes.js';
import userRoutes from './user.routes.js';
import siteConfigRoutes from './siteconfig.routes.js';
import statsRoutes from './stats.routes.js';
import categoriaRoutes from './categoria.routes.js';
import noticiaRoutes from './noticia.routes.js';
import consultaRoutes from './consulta.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/carreras', carreraRoutes);
router.use('/materias', materiaRoutes);
router.use('/usuarios', userRoutes);
router.use('/config', siteConfigRoutes);
router.use('/stats', statsRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/noticias', noticiaRoutes);
router.use('/consultas', consultaRoutes);

export default router;
