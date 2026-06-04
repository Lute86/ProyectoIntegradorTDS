import { Router } from 'express';
import * as carreraMateriaController from '../controllers/carreraMateria.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import {
  createCarreraMateriaValidation,
  updateCarreraMateriaValidation,
  idParamValidation,
} from '../middlewares/validators/carreraMateria.validator.js';

const router = Router({ mergeParams: true });

router.get('/', carreraMateriaController.getAllByCarrera);


router.get('/:id', idParamValidation, carreraMateriaController.getById);
router.use(authenticate);
router.post('/', authorize('admin'), createCarreraMateriaValidation, carreraMateriaController.create);
router.put('/:id', authorize('admin'), updateCarreraMateriaValidation, carreraMateriaController.update);
router.delete('/:id', authorize('admin'), idParamValidation, carreraMateriaController.remove);

export default router;
