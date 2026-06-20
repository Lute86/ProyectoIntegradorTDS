import { create } from 'zustand';
import api from '../services/api';

export interface GaleriaImagen {
  id: number;
  url: string;
  titulo: string;
  categoria?: string;
}

interface GaleriaState {
  imagenes: GaleriaImagen[];
  isLoading: boolean;
  error: string | null;
  fetchImagenes: () => Promise<void>;
  addImagen: (imagen: FormData | Record<string, unknown>) => Promise<void>;
  deleteImagen: (id: number) => Promise<void>;
}

export const useGaleriaStore = create<GaleriaState>((set) => ({
  imagenes: [],
  isLoading: false,
  error: null,
  fetchImagenes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/imagenes');
      set({ imagenes: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar las imagenes';
      set({ error: mensaje, isLoading: false });
    }
  },
  addImagen: async (formData: FormData) => {
    try {
      const response = await api.post('/imagenes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({ imagenes: [...state.imagenes, response.data.data] }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al subir la imagen';
      set({ error: mensaje });
    }
  },
  deleteImagen: async (id) => {
    try {
      await api.delete(`/imagenes/${id}`);
      set((state) => ({ imagenes: state.imagenes.filter((i) => i.id !== id) }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la imagen';
      set({ error: mensaje });
    }
  },
}));
