import { create } from 'zustand';
import api from '../services/api';

export interface TestimonioAPI {
  id: number;
  autor_nombre: string;
  autor_carrera: string;
  texto: string;
  visible: boolean;
}

export interface TestimonioDisplay {
  id: number;
  texto: string;
  autor_nombre: string;
  autor_carrera: string;
  iniciales: string;
}

function adaptarTestimonio(t: TestimonioAPI): TestimonioDisplay {
  const palabras = t.autor_nombre.split(' ');
  const iniciales = palabras.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return { id: t.id, texto: t.texto, autor_nombre: t.autor_nombre, autor_carrera: t.autor_carrera, iniciales };
}

interface TestimoniosState {
  testimonios: TestimonioDisplay[];
  isLoading: boolean;
  error: string | null;
  fetchTestimonios: () => Promise<void>;
}

export const useTestimoniosStore = create<TestimoniosState>((set) => ({
  testimonios: [],
  isLoading: false,
  error: null,
  fetchTestimonios: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/testimonios');
      const raw: TestimonioAPI[] = res.data.data || res.data || [];
      const visibles = raw.filter(t => t.visible).map(adaptarTestimonio);
      set({ testimonios: visibles, isLoading: false });
    } catch {
      set({ error: 'Error al cargar los testimonios', isLoading: false });
    }
  },
}));
