import { Router } from 'express';
import * as carreraController from '../controllers/carrera.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createCarreraValidation, updateCarreraValidation, idParamValidation, slugParamValidation } from '../middlewares/validators/carrera.validator.js';

const router = Router();

// Las rutas GET son publicas para que visitantes puedan ver carreras sin login
// Solo POST, PUT y DELETE requieren autenticacion y rol admin
router.get('/', carreraController.getAll);
router.get('/slug/:slug', slugParamValidation, carreraController.getBySlug);
router.get('/:id', idParamValidation, carreraController.getById);
router.post('/', authenticate, authorize('admin'), createCarreraValidation, carreraController.create);
router.put('/:id', authenticate, authorize('admin'), idParamValidation, updateCarreraValidation, carreraController.update);
router.delete('/:id', authenticate, authorize('admin'), idParamValidation, carreraController.remove);

export default router;
