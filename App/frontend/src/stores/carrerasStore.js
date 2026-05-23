import { create } from 'zustand'
import { carrerasService } from '../services/carrerasService'
import { MOCK_CARRERAS } from '../data/mockCarreras'

// Parsea requisitos y horarios de JSON string a array
function parseCarrera(c) {
  if (!c) return c
  return {
    ...c,
    requisitos: typeof c.requisitos === 'string' ? JSON.parse(c.requisitos) : c.requisitos,
    horarios: typeof c.horarios === 'string' ? JSON.parse(c.horarios) : c.horarios,
  }
}

function parseCarreras(arr) {
  return (arr || []).map(parseCarrera)
}

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
      set({ carreras: parseCarreras(carrerasData), loading: false })
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
      set({ selectedCarrera: parseCarrera(carreraData), loading: false })
    } catch {
      const carrera = MOCK_CARRERAS.find((c) => c.slug === slug) || null
      set({ selectedCarrera: carrera, loading: false })
    }
  },

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
