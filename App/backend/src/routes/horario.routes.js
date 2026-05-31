import { Router } from 'express';
import * as horarioController from '../controllers/horario.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createHorarioValidation, updateHorarioValidation, idParamValidation } from '../middlewares/validators/horario.validator.js';

const router = Router();

router.get('/', horarioController.getAll);
router.get('/:id', idParamValidation, horarioController.getById);

router.use(authenticate);
router.post('/', authorize('admin'), createHorarioValidation, horarioController.create);
router.put('/:id', authorize('admin'), idParamValidation, updateHorarioValidation, horarioController.update);
router.delete('/:id', authorize('admin'), idParamValidation, horarioController.remove);

export default router;
