import { create } from 'zustand';
import api from '../services/api';
import useUIStore from './uiStore';

export const useConsultasStore = create((set) => ({
  consultas: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  fetchConsultas: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/consultas');
      const raw = response.data?.data;
      const apiData = raw?.data ?? raw ?? [];
      set({ consultas: Array.isArray(apiData) ? apiData : [], isLoading: false });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las consultas';
      set({ error: mensaje, isLoading: false });
    }
  },
  setUnreadCount: (count) => set({ unreadCount: count }),
  fetchUnreadCount: async () => {
    try {
      const response = await api.get('/consultas/unread/count');
      set({ unreadCount: response.data.data.count });
    } catch {

      // Silencioso — no mostrar error al usuario por un contador
    }},
  responderConsulta: async (id, respuesta) => {
    try {
      const response = await api.put(`/consultas/${id}`, { respuesta, respondido: true });
      set((state) => ({
        consultas: state.consultas.map((c) =>
        c.id === id ? { ...c, ...response.data.data } : c
        )
      }));
      useUIStore.getState().setPageNotification({ message: 'Consulta respondida exitosamente', type: 'success' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al responder la consulta';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },
  eliminarConsulta: async (id) => {
    try {
      await api.delete(`/consultas/${id}`);
      set((state) => ({
        consultas: state.consultas.filter((c) => c.id !== id)
      }));
      useUIStore.getState().setPageNotification({ message: 'Consulta eliminada exitosamente', type: 'success' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la consulta';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  }
}));
