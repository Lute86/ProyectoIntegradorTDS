import api from './api'

export const carrerasService = {
  getAll: () => api.get('/carreras'),
  getBySlug: (slug) => api.get(`/carreras/slug/${slug}`),
}
