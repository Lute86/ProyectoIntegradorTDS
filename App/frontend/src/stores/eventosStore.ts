import { create } from 'zustand';
import api from '../services/api';
import useUIStore from './uiStore';

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
      useUIStore.getState().setPageNotification({ message: 'Evento creado exitosamente', type: 'success' });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear el evento';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },
  updateEvento: async (id, data) => {
    try {
      const response = await api.put(`/eventos/${id}`, data);
      set((state) => ({
        eventos: state.eventos.map((e) => (e.id === id ? { ...e, ...response.data.data } : e)),
      }));
      useUIStore.getState().setPageNotification({ message: 'Evento actualizado exitosamente', type: 'success' });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el evento';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },
  deleteEvento: async (id) => {
    try {
      await api.delete(`/eventos/${id}`);
      set((state) => ({ eventos: state.eventos.filter((e) => e.id !== id) }));
      useUIStore.getState().setPageNotification({ message: 'Evento eliminado exitosamente', type: 'success' });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar el evento';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },
}));
