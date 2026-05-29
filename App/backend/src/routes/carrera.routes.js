import { Router } from 'express';
import * as carreraController from '../controllers/carrera.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createCarreraValidation, updateCarreraValidation, idParamValidation } from '../middlewares/validators/carrera.validator.js';

const router = Router();

router.get('/', carreraController.getAll);
router.get('/:id', idParamValidation, carreraController.getById);

router.use(authenticate);

router.post('/', authorize('admin'), createCarreraValidation, carreraController.create);
router.put('/:id', authorize('admin'), idParamValidation, updateCarreraValidation, carreraController.update);
router.delete('/:id', authorize('admin'), idParamValidation, carreraController.remove);

export default router;
