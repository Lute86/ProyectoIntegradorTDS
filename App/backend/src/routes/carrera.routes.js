import { Router } from 'express';
import * as carreraController from '../controllers/carrera.controller.js';
import carreraMateriaRoutes from './carreraMateria.routes.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createCarreraValidation, updateCarreraValidation, idParamValidation, slugParamValidation } from '../middlewares/validators/carrera.validator.js';

const router = Router();

router.get('/', carreraController.getAll);
router.get('/slug/:slug', slugParamValidation, carreraController.getBySlug);
router.get('/:id', idParamValidation, carreraController.getById);

router.use('/:carreraId/materias', carreraMateriaRoutes);

router.use(authenticate);

router.post('/', authorize('admin'), createCarreraValidation, carreraController.create);
router.put('/:id', authorize('admin'), idParamValidation, updateCarreraValidation, carreraController.update);
router.delete('/:id', authorize('admin'), idParamValidation, carreraController.remove);

export default router;
