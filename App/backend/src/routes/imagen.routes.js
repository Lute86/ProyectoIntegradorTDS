import { Router } from 'express';
import * as imagenController from '../controllers/imagen.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createImagenValidation, updateImagenValidation, idParamValidation } from '../middlewares/validators/imagen.validator.js';
import upload from '../middlewares/multer.config.js';

const router = Router();

router.get('/', imagenController.getAll);
router.get('/:id', idParamValidation, imagenController.getById);
router.get('/:id/data', imagenController.getImageData);

router.use(authenticate);

router.post('/upload-imagen', authorize('admin', 'profesor'), upload.single('imagen'), imagenController.uploadImagen);
router.post('/', authorize('admin', 'profesor'), upload.single('imagen'), createImagenValidation, imagenController.create);
router.put('/:id', authorize('admin', 'profesor'), idParamValidation, upload.single('imagen'), updateImagenValidation, imagenController.update);
router.delete('/:id', authorize('admin'), idParamValidation, imagenController.remove);

export default router;
