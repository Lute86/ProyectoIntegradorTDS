import { create } from 'zustand';
import api from '../services/api';
import useUIStore from './uiStore';

export const useGaleriaStore = create((set) => ({
  imagenes: [],
  isLoading: false,
  error: null,
  fetchImagenes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/imagenes');
      set({ imagenes: response.data.data, isLoading: false });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las imagenes';
      set({ error: mensaje, isLoading: false });
    }
  },
  addImagen: async (formData) => {
    try {
      const response = await api.post('/imagenes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({ imagenes: [...state.imagenes, response.data.data] }));
      useUIStore.getState().setPageNotification({ message: 'Imagen subida exitosamente', type: 'success' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al subir la imagen';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },
  deleteImagen: async (id) => {
    try {
      await api.delete(`/imagenes/${id}`);
      set((state) => ({ imagenes: state.imagenes.filter((i) => i.id !== id) }));
      useUIStore.getState().setPageNotification({ message: 'Imagen eliminada exitosamente', type: 'success' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la imagen';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  }
}));
