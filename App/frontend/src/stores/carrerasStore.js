import { create } from 'zustand'
import api from '../services/api'

const useCarrerasStore = create((set, get) => ({
  carreras: [],
  selectedCarrera: null,
  loading: false,
  error: null,

  fetchCarreras: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/carreras')
      set({ carreras: response.data.data, loading: false })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las carreras'
      set({ error: mensaje, loading: false })
    }
  },

  fetchCarreraBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/carreras/slug/${slug}`)
      set({ selectedCarrera: response.data.data, loading: false })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar la carrera'
      set({ error: mensaje, loading: false })
    }
  },

  addCarrera: async (carrera) => {
    try {
      const response = await api.post('/carreras', carrera)
      set((state) => ({ carreras: [...state.carreras, response.data.data] }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al crear la carrera'
      set({ error: mensaje })
    }
  },

  updateCarrera: async (id, data) => {
    try {
      const response = await api.put(`/carreras/${id}`, data)
      set((state) => ({
        carreras: state.carreras.map((c) =>
          c.id === id ? { ...c, ...response.data.data } : c
        ),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al actualizar la carrera'
      set({ error: mensaje })
    }
  },

  deleteCarrera: async (id) => {
    try {
      await api.delete(`/carreras/${id}`)
      set((state) => ({
        carreras: state.carreras.filter((c) => c.id !== id),
      }))
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la carrera'
      set({ error: mensaje })
    }
  },

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
