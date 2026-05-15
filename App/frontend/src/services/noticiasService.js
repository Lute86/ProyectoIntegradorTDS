import api from './api'

export const noticiasService = {
  getAll: () => api.get('/noticias'),
  getBySlug: (slug) => api.get(`/noticias/slug/${slug}`),
}
