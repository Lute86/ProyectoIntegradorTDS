import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as consultaController from '../controllers/consulta.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { createConsultaValidation, updateConsultaValidation, idParamValidation } from '../middlewares/validators/consulta.validator.js';

const router = Router();

const consultaRateLimit = process.env.NODE_ENV === 'test'
  ? (_req, _res, next) => next()
  : rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Demasiadas consultas, intente más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
  });

router.post('/', consultaRateLimit, createConsultaValidation, consultaController.create);

router.use(authenticate);

router.get('/unread/count', consultaController.getUnreadCount);
router.get('/', consultaController.getAll);
router.get('/:id', idParamValidation, consultaController.getById);
router.put('/:id', idParamValidation, updateConsultaValidation, consultaController.update);

router.delete('/:id', authorize('admin'), idParamValidation, consultaController.remove);

export default router;
