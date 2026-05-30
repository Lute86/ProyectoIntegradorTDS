import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin', 'profesor', 'tutor'), statsController.getDashboardStats);

export default router;
