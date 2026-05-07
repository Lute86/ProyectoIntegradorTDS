import models from '../models/index.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getConfig = handleDbErrors(async () => {
  let config = await models.SiteConfig.findOne();

  if (!config) {
    config = await models.SiteConfig.create({
      site_name: 'IFTS 29',
      site_subtitle: 'Nueva Web',
    });
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
