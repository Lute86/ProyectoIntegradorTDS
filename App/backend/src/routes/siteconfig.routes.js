import { Router } from 'express';
import * as siteConfigController from '../controllers/siteconfig.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { updateSiteConfigValidation } from '../middlewares/validators/siteconfig.validator.js';

const router = Router();

router.get('/', siteConfigController.getConfig);
router.put('/', authenticate, authorize('admin'), updateSiteConfigValidation, siteConfigController.updateConfig);

export default router;
