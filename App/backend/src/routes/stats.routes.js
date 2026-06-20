import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/recent-activity', authenticate, authorize('admin'), statsController.getRecentActivity);
router.get('/dashboard', authenticate, authorize('admin', 'profesor', 'tutor'), statsController.getDashboardStats);

export default router;
