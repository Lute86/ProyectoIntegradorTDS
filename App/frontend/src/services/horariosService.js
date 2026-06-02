import api from './api'

export const horariosService = {
  getAll: (params = {}) => api.get('/horarios', { params }),
}
