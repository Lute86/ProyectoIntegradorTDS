import api from './api'

export const noticiasService = {
  getAll: (params) => api.get('/noticias', { params }),
  getBySlug: (slug) => api.get(`/noticias/slug/${slug}`),
  getCategories: () => api.get('/categorias'),
  create: (data) => api.post('/noticias', data),
  update: (id, data) => api.put(`/noticias/${id}`, data),
  remove: (id) => api.delete(`/noticias/${id}`),
}
