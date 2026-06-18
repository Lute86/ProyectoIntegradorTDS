import { validationResult } from 'express-validator';
import * as siteConfigService from '../services/siteconfig.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, validationError } from '../utils/response.js';

const MAX_DISABLED_SECTIONS = 3;

export const getConfig = asyncHandler(async (req, res) => {
  const config = await siteConfigService.getConfig();
  return success(res, config, 'Configuración obtenida exitosamente');
});

export const updateConfig = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  if (req.body.sections) {
    const config = await siteConfigService.getConfig();
    const existingSections = config.sections || [];

    const merged = [...existingSections];
    for (const sent of req.body.sections) {
      const idx = merged.findIndex(s => s.id === sent.id);
      if (idx >= 0) {
        merged[idx] = { ...merged[idx], ...sent };
      } else {
        merged.push(sent);
      }
    }

    const disabledCount = merged.filter(s => s.visible === false).length;

    if (disabledCount === merged.length && merged.length > 0) {
      return validationError(res, [{ msg: 'Debe haber al menos una sección habilitada en la página principal' }]);
    }

    if (disabledCount > MAX_DISABLED_SECTIONS) {
      return validationError(res, [{ msg: `No se pueden deshabilitar más de ${MAX_DISABLED_SECTIONS} secciones de la página principal` }]);
    }

    req.body.sections = merged;
  }

  const config = await siteConfigService.updateConfig(req.body);
  return success(res, config, 'Configuración actualizada exitosamente');
});
