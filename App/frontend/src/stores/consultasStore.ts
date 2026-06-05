import { create } from 'zustand';
import api from '../services/api';

export interface Consulta {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  respondido: boolean;
  respuesta: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConsultasState {
  consultas: Consulta[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchConsultas: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  responderConsulta: (id: number, respuesta: string) => Promise<void>;
  eliminarConsulta: (id: number) => Promise<void>;
}

export const useConsultasStore = create<ConsultasState>((set) => ({
  consultas: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  fetchConsultas: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/consultas');
      const apiData = response.data?.data || response.data || [];
      set({ consultas: Array.isArray(apiData) ? apiData : [], isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar las consultas';
      set({ error: mensaje, isLoading: false });
    }
  },
  fetchUnreadCount: async () => {
    try {
      const response = await api.get('/consultas/unread/count');
      set({ unreadCount: response.data.data.count });
    } catch {
      // Silencioso — no mostrar error al usuario por un contador
    }
  },
  responderConsulta: async (id, respuesta) => {
    try {
      const response = await api.put(`/consultas/${id}`, { respuesta, respondido: true });
      set((state) => ({
        consultas: state.consultas.map((c) =>
          c.id === id ? { ...c, ...response.data.data } : c
        ),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al responder la consulta';
      set({ error: mensaje });
    }
  },
  eliminarConsulta: async (id) => {
    try {
      await api.delete(`/consultas/${id}`);
      set((state) => ({
        consultas: state.consultas.filter((c) => c.id !== id),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la consulta';
      set({ error: mensaje });
    }
  },
}));
