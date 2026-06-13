import { Router } from 'express';
import * as comisionController from '../controllers/comision.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createComisionValidation, updateComisionValidation, idParamValidation } from '../middlewares/validators/comision.validator.js';

const router = Router();

router.get('/', comisionController.getAll);
router.get('/:id', idParamValidation, comisionController.getById);

router.use(authenticate);
router.post('/', authorize('admin'), createComisionValidation, comisionController.create);
router.put('/:id', authorize('admin'), idParamValidation, updateComisionValidation, comisionController.update);
router.delete('/:id', authorize('admin'), idParamValidation, comisionController.remove);

export default router;
