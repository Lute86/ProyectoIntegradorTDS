import { Router } from 'express';
import * as eventoController from '../controllers/evento.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createEventoValidation, updateEventoValidation, idParamValidation } from '../middlewares/validators/evento.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', eventoController.getAll);
router.get('/:id', idParamValidation, eventoController.getById);
router.post('/', authorize('admin', 'profesor'), createEventoValidation, eventoController.create);
router.put('/:id', authorize('admin', 'profesor'), idParamValidation, updateEventoValidation, eventoController.update);
router.delete('/:id', authorize('admin'), idParamValidation, eventoController.remove);

export default router;
