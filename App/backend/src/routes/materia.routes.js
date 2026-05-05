import { Router } from 'express';
import * as materiaController from '../controllers/materia.controller.js';
import { createMateriaValidation, updateMateriaValidation, idParamValidation } from '../middlewares/validators/materia.validator.js';

const router = Router();

router.get('/', materiaController.getAll);
router.post('/', createMateriaValidation, materiaController.create);
router.get('/:id', idParamValidation, materiaController.getById);
router.put('/:id', idParamValidation, updateMateriaValidation, materiaController.update);
router.delete('/:id', idParamValidation, materiaController.remove);

export default router;
