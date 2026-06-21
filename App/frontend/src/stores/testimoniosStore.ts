import { create } from 'zustand';
import api from '../services/api';

export interface Testimonio {
  id: number;
  autor_nombre: string;
  autor_carrera: string;
  texto: string;
  visible: boolean;
}

interface TestimoniosState {
  testimonios: Testimonio[];
  isLoading: boolean;
  error: string | null;
  fetchTestimonios: (params?: Record<string, unknown>) => Promise<void>;
  addTestimonio: (testimonio: Omit<Testimonio, 'id'>) => Promise<void>;
  updateTestimonio: (id: number, data: Partial<Testimonio>) => Promise<void>;
  deleteTestimonio: (id: number) => Promise<void>;
}

export const useTestimoniosStore = create<TestimoniosState>((set) => ({
  testimonios: [],
  isLoading: false,
  error: null,
  fetchTestimonios: async (params?: Record<string, unknown>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/testimonios', { params });
      set({ testimonios: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar los testimonios';
      set({ error: mensaje, isLoading: false });
    }
  },
  addTestimonio: async (nuevoTestimonio) => {
    try {
      const response = await api.post('/testimonios', nuevoTestimonio);
      set((state) => ({ testimonios: [...state.testimonios, response.data.data] }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear el testimonio';
      set({ error: mensaje });
    }
  },
  updateTestimonio: async (id, data) => {
    try {
      const response = await api.put(`/testimonios/${id}`, data);
      set((state) => ({
        testimonios: state.testimonios.map((t) => (t.id === id ? { ...t, ...response.data.data } : t)),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el testimonio';
      set({ error: mensaje });
    }
  },
  deleteTestimonio: async (id) => {
    try {
      await api.delete(`/testimonios/${id}`);
      set((state) => ({ testimonios: state.testimonios.filter((t) => t.id !== id) }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar el testimonio';
      set({ error: mensaje });
    }
  },
}));
