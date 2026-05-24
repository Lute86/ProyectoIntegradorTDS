import { create } from 'zustand'
import { carrerasService } from '../services/carrerasService'

const CACHE_TTL = 30000

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
  _lastFetched: 0,

  fetchCarreras: async () => {
    if (Date.now() - get()._lastFetched < CACHE_TTL && get().carreras.length > 0) return
    set({ loading: true, error: null })
    try {
      const res = await carrerasService.getAll()
      const carrerasData = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      set({ carreras: parseCarreras(carrerasData), loading: false, _lastFetched: Date.now() })
    } catch (err) {
      set({ error: err?.response?.data?.message || err.message, loading: false })
    }
  },

  fetchCarreraBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const res = await carrerasService.getBySlug(slug)
      const carreraData = res.data?.data || res.data
      set({ selectedCarrera: parseCarrera(carreraData), loading: false })
    } catch (err) {
      set({ selectedCarrera: null, error: err?.response?.data?.message || err.message, loading: false })
    }
  },

  setSelectedCarrera: (carrera) => set({ selectedCarrera: carrera }),
}))

export default useCarrerasStore
