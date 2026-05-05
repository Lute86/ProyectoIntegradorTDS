import { Router } from 'express';
import * as carreraController from '../controllers/carrera.controller.js';
import { createCarreraValidation, updateCarreraValidation, idParamValidation } from '../middlewares/validators/carrera.validator.js';

const router = Router();

router.get('/', carreraController.getAll);
router.post('/', createCarreraValidation, carreraController.create);
router.get('/:id', idParamValidation, carreraController.getById);
router.put('/:id', idParamValidation, updateCarreraValidation, carreraController.update);
router.delete('/:id', idParamValidation, carreraController.remove);

export default router;
