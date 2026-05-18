import { create } from 'zustand';
import { Testimonio, TESTIMONIOS_MOCK } from '../mocks/testimonios.mock';

interface TestimoniosState {
  testimonios: Testimonio[];
  isLoading: boolean;
  error: string | null;
  fetchTestimonios: () => Promise<void>;
  addTestimonio: (testimonio: Omit<Testimonio, 'id'>) => void;
  updateTestimonio: (id: number, data: Partial<Testimonio>) => void;
  deleteTestimonio: (id: number) => void;
}

export const useTestimoniosStore = create<TestimoniosState>((set) => ({
  testimonios: [],
  isLoading: false,
  error: null,
  fetchTestimonios: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ testimonios: TESTIMONIOS_MOCK, isLoading: false });
    } catch {
      set({ error: 'Error al cargar los testimonios', isLoading: false });
    }
  },
  addTestimonio: (nuevoTestimonio) => {
    set((state) => ({
      testimonios: [
        ...state.testimonios,
        {
          ...nuevoTestimonio,
          id: Math.max(...state.testimonios.map((t) => t.id), 0) + 1,
        },
      ],
    }));
  },
  updateTestimonio: (id, data) => {
    set((state) => ({
      testimonios: state.testimonios.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },
  deleteTestimonio: (id) => {
    set((state) => ({
      testimonios: state.testimonios.filter((t) => t.id !== id),
    }));
  },
}));
