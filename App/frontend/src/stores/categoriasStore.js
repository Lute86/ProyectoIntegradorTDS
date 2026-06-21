import { create } from 'zustand';
import api from '../services/api';

export const useCategoriasStore = create((set) => ({
  categorias: [],
  isLoading: false,
  error: null,
  fetchCategorias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/categorias');
      set({ categorias: response.data.data, isLoading: false });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las categorias';
      set({ error: mensaje, isLoading: false });
    }
  }
}));
