import { Router } from 'express';
import * as materiaController from '../controllers/materia.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createMateriaValidation, updateMateriaValidation, idParamValidation } from '../middlewares/validators/materia.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', materiaController.getAll);
router.get('/:id', idParamValidation, materiaController.getById);
router.post('/', authorize('admin', 'profesor'), createMateriaValidation, materiaController.create);
router.put('/:id', authorize('admin', 'profesor'), idParamValidation, updateMateriaValidation, materiaController.update);
router.delete('/:id', authorize('admin'), idParamValidation, materiaController.remove);

export default router;
