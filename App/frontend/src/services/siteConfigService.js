import api from './api'

export const siteConfigService = {
  getConfig: () => api.get('/config'),
}
