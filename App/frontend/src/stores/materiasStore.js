import { create } from 'zustand'
import api from '../services/api'

const TTL = 30000

const useMateriasStore = create((set, get) => ({
  materias: [],
  asignaciones: [],
  loading: false,
  error: null,
  _lastFetched: 0,

  fetchMaterias: async () => {
    const now = Date.now()
    if (now - get()._lastFetched < TTL && get().materias.length > 0) return
    set({ loading: true, error: null })
    try {
      const response = await api.get('/materias')
      set({ materias: response.data.data, loading: false, _lastFetched: Date.now() })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las materias'
      set({ error: mensaje, loading: false })
    }
  },

  createMateria: async (data) => {
    try {
      const response = await api.post('/materias', data)
      set((state) => ({ materias: [...state.materias, response.data.data] }))
      return response.data.data
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al crear la materia'
      set({ error: mensaje })
      throw err
    }
  },

  updateMateria: async (id, data) => {
    try {
      const response = await api.put(`/materias/${id}`, data)
      set((state) => ({
        materias: state.materias.map((m) =>
          m.id === id ? { ...m, ...response.data.data } : m
        ),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al actualizar la materia'
      set({ error: mensaje })
      throw err
    }
  },

  deleteMateria: async (id) => {
    try {
      await api.delete(`/materias/${id}`)
      set((state) => ({
        materias: state.materias.filter((m) => m.id !== id),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la materia'
      set({ error: mensaje })
      throw err
    }
  },

  fetchAsignaciones: async (carreraId) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/carreras/${carreraId}/materias`)
      set({ asignaciones: response.data.data, loading: false })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las asignaciones'
      set({ error: mensaje, loading: false })
    }
  },

  addAsignacion: async (carreraId, data) => {
    try {
      const response = await api.post(`/carreras/${carreraId}/materias`, data)
      set((state) => ({ asignaciones: [...state.asignaciones, response.data.data] }))
      return response.data.data
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al asignar la materia'
      set({ error: mensaje })
      throw err
    }
  },

  updateAsignacion: async (carreraId, id, data) => {
    try {
      const response = await api.put(`/carreras/${carreraId}/materias/${id}`, data)
      set((state) => ({
        asignaciones: state.asignaciones.map((a) =>
          a.id === id ? { ...a, ...response.data.data } : a
        ),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al actualizar la asignacion'
      set({ error: mensaje })
      throw err
    }
  },

  clearError: () => set({ error: null }),

  removeAsignacion: async (carreraId, id) => {
    try {
      await api.delete(`/carreras/${carreraId}/materias/${id}`)
      set((state) => ({
        asignaciones: state.asignaciones.filter((a) => a.id !== id),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la asignacion'
      set({ error: mensaje })
      throw err
    }
  },
}))

export default useMateriasStore
