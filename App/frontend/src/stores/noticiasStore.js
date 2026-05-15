import { create } from 'zustand'
import { noticiasService } from '../services/noticiasService'
import { MOCK_NOTICIAS } from '../data/mockNoticias'

const useNoticiasStore = create((set) => ({
  noticias: [],
  selectedNoticia: null,
  loading: false,
  error: null,

  fetchNoticias: async () => {
    set({ loading: true, error: null })
    try {
      const res = await noticiasService.getAll()
      const noticiasData = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      set({ noticias: noticiasData, loading: false })
    } catch {
      set({ noticias: MOCK_NOTICIAS, loading: false })
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
