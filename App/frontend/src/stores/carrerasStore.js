import { create } from 'zustand'
import api from '../services/api'
import useUIStore from './uiStore'

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
    set({ loading: true, error: null, selectedCarrera: null })
    try {
      const response = await api.get(`/carreras/slug/${slug}`)
      set({ selectedCarrera: response.data.data, loading: false })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar la carrera'
      set({ error: mensaje, loading: false })
    }
  },

  fetchCarreraById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/carreras/${id}`)
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
      useUIStore.getState().setPageNotification({ message: 'Carrera creada exitosamente', type: 'success' })
    } catch (err) {
      let mensaje = err.response?.data?.message || 'Error al crear la carrera'
      mensaje = mensaje.replace(/[Ss]lug/g, 'título')
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' })
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
      useUIStore.getState().setPageNotification({ message: 'Carrera actualizada exitosamente', type: 'success' })
    } catch (err) {
      let mensaje = err.response?.data?.message || 'Error al actualizar la carrera'
      mensaje = mensaje.replace(/[Ss]lug/g, 'título')
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' })
    }
  },

  deleteCarrera: async (id) => {
    try {
      await api.delete(`/carreras/${id}`)
      set((state) => ({
        carreras: state.carreras.filter((c) => c.id !== id),
      }))
      useUIStore.getState().setPageNotification({ message: 'Carrera eliminada exitosamente', type: 'success' })
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la carrera'
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' })
    }
  },

  clearError: () => set({ error: null }),

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
