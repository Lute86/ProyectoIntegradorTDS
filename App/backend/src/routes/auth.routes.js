import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { loginValidation, refreshValidation } from '../middlewares/validators/auth.validator.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos. Intentá de nuevo en 15 minutos.' },
});

router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/refresh', refreshValidation, authController.refresh);
router.get('/profile', authenticate, authController.getProfile);

export default router;
