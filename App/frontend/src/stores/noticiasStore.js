import { create } from 'zustand'
import { noticiasService } from '../services/noticiasService'
import { MOCK_NOTICIAS } from '../data/mockNoticias'

const CACHE_TTL = 30000

const useNoticiasStore = create((set, get) => ({
  noticias: [],
  selectedNoticia: null,
  loading: false,
  error: null,
  _lastFetched: 0,

  fetchNoticias: async () => {
    if (Date.now() - get()._lastFetched < CACHE_TTL && get().noticias.length > 0) return
    set({ loading: true, error: null })
    try {
      const res = await noticiasService.getAll()
      const noticiasData = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      set({ noticias: noticiasData, loading: false, _lastFetched: Date.now() })
    } catch {
      set({ noticias: MOCK_NOTICIAS, loading: false, _lastFetched: Date.now() })
    }
  },

  fetchNoticiaBySlug: async (slug) => {
    set({ loading: true, error: null })
    try {
      const res = await noticiasService.getBySlug(slug)
      const noticiaData = res.data?.data || res.data
      set({ selectedNoticia: noticiaData, loading: false })
    } catch {
      const noticia = MOCK_NOTICIAS.find((n) => n.slug === slug) || null
      set({ selectedNoticia: noticia, loading: false })
    }
  },

  setSelectedNoticia: (noticia) => set({ selectedNoticia: noticia }),
}))

export default useNoticiasStore
