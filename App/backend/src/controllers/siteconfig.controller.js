import * as siteConfigService from '../services/siteconfig.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, updated } from '../utils/response.js';

export const getConfig = asyncHandler(async (req, res) => {
  const config = await siteConfigService.getConfig();
  return success(res, config, 'Configuración obtenida exitosamente');
});

export const updateConfig = asyncHandler(async (req, res) => {
  const config = await siteConfigService.updateConfig(req.body);
  return updated(res, config, 'Configuración actualizada exitosamente');
});
