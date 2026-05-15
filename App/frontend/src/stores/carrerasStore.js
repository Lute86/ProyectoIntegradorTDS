import { create } from 'zustand'
import { carrerasService } from '../services/carrerasService'
import { MOCK_CARRERAS } from '../data/mockCarreras'

const useCarrerasStore = create((set, get) => ({
  carreras: [],
  selectedCarrera: null,
  loading: false,
  error: null,

  fetchCarreras: async () => {
    set({ loading: true, error: null })
    try {
      const res = await carrerasService.getAll()
      // El backend devuelve { success, data: [...], message }
      // Extraemos el array de carreras compatiblemente
      const carrerasData = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      set({ carreras: carrerasData, loading: false })
    } catch {
      set({ carreras: MOCK_CARRERAS, loading: false })
    }
  },

  fetchCarreraBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const res = await carrerasService.getBySlug(slug)
      // El backend devuelve { success, data: {...}, message }
      const carreraData = res.data?.data || res.data
      set({ selectedCarrera: carreraData, loading: false })
    } catch {
      const carrera = MOCK_CARRERAS.find((c) => c.slug === slug) || null
      set({ selectedCarrera: carrera, loading: false })
    }
  },

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
