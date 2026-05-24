import { Router } from 'express';
import * as noticiaController from '../controllers/noticia.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createNoticiaValidation, updateNoticiaValidation, idParamValidation, slugParamValidation } from '../middlewares/validators/noticia.validator.js';
import upload from '../middlewares/multer.config.js';

const router = Router();

router.use(authenticate);

router.post('/upload-imagen', authorize('admin', 'profesor'), upload.single('imagen'), noticiaController.uploadImagen);

router.get('/', noticiaController.getAll);
router.get('/slug/:slug', slugParamValidation, noticiaController.getBySlug);
router.get('/:id', idParamValidation, noticiaController.getById);
router.post('/', authorize('admin', 'profesor'), createNoticiaValidation, noticiaController.create);
router.put('/:id', authorize('admin', 'profesor'), idParamValidation, updateNoticiaValidation, noticiaController.update);
router.delete('/:id', authorize('admin'), idParamValidation, noticiaController.remove);

export default router;
