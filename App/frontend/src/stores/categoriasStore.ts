import { create } from 'zustand';
import api from '../services/api';

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  color?: string;
}

interface CategoriasState {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  fetchCategorias: () => Promise<void>;
}

export const useCategoriasStore = create<CategoriasState>((set) => ({
  categorias: [],
  isLoading: false,
  error: null,
  fetchCategorias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/categorias');
      set({ categorias: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar las categorias';
      set({ error: mensaje, isLoading: false });
    }
  },
}));
