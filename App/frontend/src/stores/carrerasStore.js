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
      const { data } = await carrerasService.getAll()
      set({ carreras: data, loading: false })
    } catch {
      set({ carreras: MOCK_CARRERAS, loading: false })
    }
  },

  fetchCarreraBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const { data } = await carrerasService.getBySlug(slug)
      set({ selectedCarrera: data, loading: false })
    } catch {
      const carrera = MOCK_CARRERAS.find((c) => c.slug === slug) || null
      set({ selectedCarrera: carrera, loading: false })
    }
  },

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
