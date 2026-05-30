import { Router } from 'express';
import * as noticiaController from '../controllers/noticia.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { requireNoticiaOwnership } from '../middlewares/noticiaOwnership.middleware.js';
import { createNoticiaValidation, updateNoticiaValidation, idParamValidation, slugParamValidation } from '../middlewares/validators/noticia.validator.js';
import upload from '../middlewares/multer.config.js';

const router = Router();

router.get('/', noticiaController.getAll);
router.get('/slug/:slug', slugParamValidation, noticiaController.getBySlug);
router.get('/:id', idParamValidation, noticiaController.getById);

router.use(authenticate);

router.post('/upload-imagen', authorize('admin', 'profesor', 'tutor'), upload.single('imagen'), noticiaController.uploadImagen);
router.post('/', authorize('admin', 'profesor', 'tutor'), createNoticiaValidation, noticiaController.create);
router.put('/:id', idParamValidation, updateNoticiaValidation, requireNoticiaOwnership(), noticiaController.update);
router.delete('/:id', idParamValidation, requireNoticiaOwnership(), noticiaController.remove);

export default router;
