import api from './api'

export const materiasService = {
  getAll: () => api.get('/materias'),
  getById: (id) => api.get(`/materias/${id}`),
  create: (data) => api.post('/materias', data),
  update: (id, data) => api.put(`/materias/${id}`, data),
  delete: (id) => api.delete(`/materias/${id}`),

  getAsignacionesByCarrera: (carreraId) => api.get(`/carreras/${carreraId}/materias`),
  addAsignacion: (carreraId, data) => api.post(`/carreras/${carreraId}/materias`, data),
  updateAsignacion: (carreraId, id, data) => api.put(`/carreras/${carreraId}/materias/${id}`, data),
  removeAsignacion: (carreraId, id) => api.delete(`/carreras/${carreraId}/materias/${id}`),
}
