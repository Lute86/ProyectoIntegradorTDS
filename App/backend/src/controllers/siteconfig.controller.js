import { validationResult } from 'express-validator';
import * as siteConfigService from '../services/siteconfig.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, validationError } from '../utils/response.js';

export const getConfig = asyncHandler(async (req, res) => {
  const config = await siteConfigService.getConfig();
  return success(res, config, 'Configuración obtenida exitosamente');
});

export const updateConfig = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const config = await siteConfigService.updateConfig(req.body);
  return success(res, config, 'Configuración actualizada exitosamente');
});
