import { create } from 'zustand';
import api from '../services/api';

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

interface NoticiasState {
  noticias: Noticia[];
  isLoading: boolean;
  error: string | null;
  fetchNoticias: () => Promise<void>;
  addNoticia: (noticia: FormData | Record<string, unknown>) => Promise<void>;
  updateNoticia: (id: number, data: FormData | Record<string, unknown>) => Promise<void>;
  deleteNoticia: (id: number) => Promise<void>;
}

export const useNoticiasStore = create<NoticiasState>((set) => ({
  noticias: [],
  isLoading: false,
  error: null,
  fetchNoticias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/noticias');
      set({ noticias: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar las noticias';
      set({ error: mensaje, isLoading: false });
    }
  },
  addNoticia: async (nuevaNoticia) => {
    try {
      const response = await api.post('/noticias', nuevaNoticia);
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
      const response = await api.put(`/noticias/${id}`, data);
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
      await api.delete(`/noticias/${id}`);
      set((state) => ({
        noticias: state.noticias.filter((n) => n.id !== id),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la noticia';
      set({ error: mensaje });
    }
  },
}));
