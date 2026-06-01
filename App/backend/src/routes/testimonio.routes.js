import { Router } from 'express';
import * as testimonioController from '../controllers/testimonio.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createTestimonioValidation, updateTestimonioValidation, idParamValidation } from '../middlewares/validators/testimonio.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', testimonioController.getAll);
router.get('/:id', idParamValidation, testimonioController.getById);
router.post('/', authorize('admin', 'profesor'), createTestimonioValidation, testimonioController.create);
router.put('/:id', authorize('admin', 'profesor'), idParamValidation, updateTestimonioValidation, testimonioController.update);
router.delete('/:id', authorize('admin'), idParamValidation, testimonioController.remove);

export default router;
