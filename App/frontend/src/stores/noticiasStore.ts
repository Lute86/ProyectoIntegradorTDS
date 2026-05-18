import { create } from 'zustand';
import { Noticia, NOTICIAS_MOCK } from '../mocks/noticias.mock';

interface NoticiasState {
  noticias: Noticia[];
  isLoading: boolean;
  error: string | null;
  fetchNoticias: () => Promise<void>;
  addNoticia: (noticia: Omit<Noticia, 'id'>) => void;
  updateNoticia: (id: number, data: Partial<Noticia>) => void;
  deleteNoticia: (id: number) => void;
}

export const useNoticiasStore = create<NoticiasState>((set) => ({
  noticias: [],
  isLoading: false,
  error: null,
  fetchNoticias: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ noticias: NOTICIAS_MOCK, isLoading: false });
    } catch {
      set({ error: 'Error al cargar las noticias', isLoading: false });
    }
  },
  addNoticia: (nuevaNoticia) => {
    set((state) => ({
      noticias: [
        ...state.noticias,
        {
          ...nuevaNoticia,
          id: Math.max(...state.noticias.map((n) => n.id), 0) + 1,
        },
      ],
    }));
  },
  updateNoticia: (id, data) => {
    set((state) => ({
      noticias: state.noticias.map((n) => (n.id === id ? { ...n, ...data } : n)),
    }));
  },
  deleteNoticia: (id) => {
    set((state) => ({
      noticias: state.noticias.filter((n) => n.id !== id),
    }));
  },
}));
