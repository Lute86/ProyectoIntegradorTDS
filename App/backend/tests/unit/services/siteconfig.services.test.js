import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { SiteConfig: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getConfig, updateConfig } = await import('../../../src/services/siteconfig.services.js');

describe('siteconfig.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConfig', () => {
    it('deberia retornar la configuración existente', async () => {
      const config = createInstanceMock({ id: 1, site_name: 'IFTS 29' });
      models.SiteConfig.findOne.mockResolvedValue(config);

      const result = await getConfig();

      expect(result.site_name).toBe('IFTS 29');
      expect(models.SiteConfig.create).not.toHaveBeenCalled();
    });

    it('deberia crear configuración por defecto si no existe', async () => {
      models.SiteConfig.findOne.mockResolvedValue(null);
      models.SiteConfig.create.mockResolvedValue(
        createInstanceMock({ id: 1, site_name: 'IFTS 29', site_subtitle: 'Nueva Web' })
      );

      const result = await getConfig();

      expect(models.SiteConfig.create).toHaveBeenCalledWith({
        site_name: 'IFTS 29',
        site_subtitle: 'Nueva Web',
      });
      expect(result.site_name).toBe('IFTS 29');
    });
  });

  describe('updateConfig', () => {
    it('deberia actualizar la configuración existente', async () => {
      const config = createInstanceMock({ id: 1, site_name: 'Old' });
      models.SiteConfig.findOne.mockResolvedValue(config);

      const result = await updateConfig({ site_name: 'New' });

      expect(config.update).toHaveBeenCalledWith({ site_name: 'New' });
    });

    it('deberia crear configuración si no existe', async () => {
      models.SiteConfig.findOne.mockResolvedValue(null);
      models.SiteConfig.create.mockResolvedValue(
        createInstanceMock({ id: 1, site_name: 'IFTS 29' })
      );

      const result = await updateConfig({ site_name: 'IFTS 29' });

      expect(models.SiteConfig.create).toHaveBeenCalledWith({ site_name: 'IFTS 29' });
    });
  });
});
