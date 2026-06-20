import api from './api'

export const comisionesService = {
  getAll: (params = {}) => api.get('/comisiones', { params }),
  getById: (id) => api.get(`/comisiones/${id}`),
  create: (data) => api.post('/comisiones', data),
  update: (id, data) => api.put(`/comisiones/${id}`, data),
  delete: (id) => api.delete(`/comisiones/${id}`),
  assignMaterias: (id, carreraMateriasIds) =>
    api.post(`/comisiones/${id}/materias`, { carrera_materias_ids: carreraMateriasIds }),
  removeMateria: (id, carreraMateriaId) =>
    api.delete(`/comisiones/${id}/materias/${carreraMateriaId}`),
}
