import { create } from 'zustand';
import api from '../services/api';

export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  estado: string;
}

interface EventosState {
  eventos: Evento[];
  isLoading: boolean;
  error: string | null;
  fetchEventos: () => Promise<void>;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<void>;
  updateEvento: (id: number, data: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: number) => Promise<void>;
}

export const useEventosStore = create<EventosState>((set) => ({
  eventos: [],
  isLoading: false,
  error: null,
  fetchEventos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/eventos');
      set({ eventos: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar los eventos';
      set({ error: mensaje, isLoading: false });
    }
  },
  addEvento: async (nuevoEvento) => {
    try {
      const response = await api.post('/eventos', nuevoEvento);
      set((state) => ({ eventos: [...state.eventos, response.data.data] }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear el evento';
      set({ error: mensaje });
    }
  },
  updateEvento: async (id, data) => {
    try {
      const response = await api.put(`/eventos/${id}`, data);
      set((state) => ({
        eventos: state.eventos.map((e) => (e.id === id ? { ...e, ...response.data.data } : e)),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el evento';
      set({ error: mensaje });
    }
  },
  deleteEvento: async (id) => {
    try {
      await api.delete(`/eventos/${id}`);
      set((state) => ({ eventos: state.eventos.filter((e) => e.id !== id) }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar el evento';
      set({ error: mensaje });
    }
  },
}));
