import { create } from 'zustand';
import { noticiasService } from '../services/noticiasService';

export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  categoria_id: number;
  autor_id: number;
  estado: string;
  fecha_publicacion: string;
  imagen_destacada_url?: string;
  slug?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  color: string;
}

const TTL = 30000;

interface NoticiasState {
  noticias: Noticia[];
  selectedNoticia: Noticia | null;
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  _lastFetched: number;
  fetchNoticias: () => Promise<void>;
  fetchNoticiaBySlug: (slug: string) => Promise<void>;
  fetchCategorias: () => Promise<void>;
  addNoticia: (noticia: FormData | Record<string, unknown>) => Promise<void>;
  updateNoticia: (id: number, data: FormData | Record<string, unknown>) => Promise<void>;
  deleteNoticia: (id: number) => Promise<void>;
  setSelectedNoticia: (noticia: Noticia | null) => void;
}

export const useNoticiasStore = create<NoticiasState>((set, get) => ({
  noticias: [],
  selectedNoticia: null,
  categorias: [],
  isLoading: false,
  error: null,
  _lastFetched: 0,

  fetchNoticias: async () => {
    const now = Date.now();
    const { _lastFetched, noticias } = get();
    if (_lastFetched > 0 && now - _lastFetched < TTL && noticias.length > 0) {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await noticiasService.getAll();
      const datos = response.data?.data;
      set({ noticias: Array.isArray(datos) ? datos : [], isLoading: false, _lastFetched: Date.now() });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar las noticias';
      set({ error: mensaje, isLoading: false });
    }
  },

  fetchNoticiaBySlug: async (slug: string) => {
    set({ isLoading: true, error: null, selectedNoticia: null });
    try {
      const response = await noticiasService.getBySlug(slug);
      set({ selectedNoticia: response.data?.data || response.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar la noticia';
      set({ error: mensaje, isLoading: false });
    }
  },

  fetchCategorias: async () => {
    const now = Date.now();
    const { _lastFetched, categorias } = get();
    if (_lastFetched > 0 && now - _lastFetched < TTL && categorias.length > 0) {
      return;
    }
    try {
      const response = await noticiasService.getCategories();
      set({ categorias: response.data.data, _lastFetched: Date.now() });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar categorias';
      set({ error: mensaje });
    }
  },

  addNoticia: async (nuevaNoticia) => {
    try {
      const response = await noticiasService.create(nuevaNoticia);
      set((state) => ({
        noticias: [...state.noticias, response.data.data],
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear la noticia';
      set({ error: mensaje });
    }
  },

  updateNoticia: async (id, data) => {
    try {
      const response = await noticiasService.update(id, data);
      set((state) => ({
        noticias: state.noticias.map((n) =>
          n.id === id ? { ...n, ...response.data.data } : n
        ),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar la noticia';
      set({ error: mensaje });
    }
  },

  deleteNoticia: async (id) => {
    try {
      await noticiasService.remove(id);
      set((state) => ({
        noticias: state.noticias.filter((n) => n.id !== id),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la noticia';
      set({ error: mensaje });
    }
  },

  setSelectedNoticia: (noticia) => set({ selectedNoticia: noticia }),
}));
