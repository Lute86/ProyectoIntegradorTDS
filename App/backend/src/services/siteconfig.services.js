import models from '../models/index.js';
import { NotFoundError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getConfig = handleDbErrors(async () => {
  let config = await models.SiteConfig.findOne();

  if (!config) {
    throw new NotFoundError('Configuración del sitio no encontrada');
  }

  return config;
});

export const updateConfig = handleDbErrors(async (data) => {
  let config = await models.SiteConfig.findOne();

  if (!config) {
    config = await models.SiteConfig.create(data);
  } else {
    await config.update(data);
  }

  return config;
});
