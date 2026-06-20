import { Router } from 'express';
import * as categoriaController from '../controllers/categoria.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createCategoriaValidation, updateCategoriaValidation, idParamValidation } from '../middlewares/validators/categoria.validator.js';

const router = Router();


router.get('/', categoriaController.getAll);
router.get('/:id', idParamValidation, categoriaController.getById);

router.use(authenticate);
router.post('/', authorize('admin'), createCategoriaValidation, categoriaController.create);
router.put('/:id', authorize('admin'), idParamValidation, updateCategoriaValidation, categoriaController.update);
router.delete('/:id', authorize('admin'), idParamValidation, categoriaController.remove);

export default router;
