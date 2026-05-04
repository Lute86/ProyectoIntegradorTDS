import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { loginValidation, registerValidation, refreshValidation } from '../middlewares/validators/auth.validator.js';

const router = Router();

router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);
router.post('/refresh', refreshValidation, authController.refresh);
router.get('/profile', authenticate, authController.getProfile);

export default router;
