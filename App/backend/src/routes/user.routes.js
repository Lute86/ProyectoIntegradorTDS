import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createUserValidation, updateUserValidation, idParamValidation } from '../middlewares/validators/user.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), userController.getAll);
router.get('/:id', idParamValidation, userController.getById);
router.post('/', authorize('admin'), createUserValidation, userController.create);
router.put('/:id', idParamValidation, updateUserValidation, userController.update);
router.delete('/:id', authorize('admin'), idParamValidation, userController.remove);
router.patch('/:id/toggle-active', authorize('admin'), idParamValidation, userController.toggleActive);

export default router;
