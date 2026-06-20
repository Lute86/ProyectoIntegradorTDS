import api from './api'

export const eventosService = {
  getEventos: async (params = {}) => {
    try {
      const res = await api.get('/eventos', { params })
      return res.data?.data || res.data || []
    } catch {
      return null
    }
  },
}
