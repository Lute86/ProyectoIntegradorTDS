import { validationResult } from 'express-validator';
import * as siteConfigService from '../services/siteconfig.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, validationError } from '../utils/response.js';

const MAX_DISABLED_SECTIONS = 3;

export const getConfig = asyncHandler(async (req, res) => {
  const config = await siteConfigService.getConfig();
  console.log('[DEBUG backend GET] Sections from DB:', JSON.stringify(config.sections?.map(s => ({ id: s.id, order: s.order }))))
  return success(res, config, 'Configuración obtenida exitosamente');
});

export const updateConfig = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  console.log('[DEBUG backend PUT] Incoming sections:', JSON.stringify(req.body.sections?.map(s => ({ id: s.id, order: s.order }))))

  if (req.body.sections) {
    const config = await siteConfigService.getConfig();
    const existingSections = config.sections || [];
    console.log('[DEBUG backend PUT] Existing sections in DB:', JSON.stringify(existingSections.map(s => ({ id: s.id, order: s.order }))))

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
    console.log('[DEBUG backend PUT] Merged sections to save:', JSON.stringify(merged.map(s => ({ id: s.id, order: s.order }))))
  }

  const config = await siteConfigService.updateConfig(req.body);
  console.log('[DEBUG backend PUT] Saved config sections:', JSON.stringify(config.sections?.map(s => ({ id: s.id, order: s.order }))))
  return success(res, config, 'Configuración actualizada exitosamente');
});
