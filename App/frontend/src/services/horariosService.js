import api from './api'

export const horariosService = {
  getAll: (params = {}) => api.get('/horarios', { params }),
  create: (data) => api.post('/horarios', data),
  update: (id, data) => api.put(`/horarios/${id}`, data),
  delete: (id) => api.delete(`/horarios/${id}`),
}
