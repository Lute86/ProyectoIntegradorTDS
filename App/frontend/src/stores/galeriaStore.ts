import { create } from 'zustand';
import api from '../services/api';

export interface GaleriaImagen {
  id: number;
  titulo: string;
  categoria?: string;
  url: string;
}

interface GaleriaState {
  imagenes: GaleriaImagen[];
  isLoading: boolean;
  error: string | null;
  fetchImagenes: () => Promise<void>;
}

export const useGaleriaStore = create<GaleriaState>((set) => ({
  imagenes: [],
  isLoading: false,
  error: null,
  fetchImagenes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/imagenes');
      set({ imagenes: res.data.data || res.data || [], isLoading: false });
    } catch {
      set({ error: 'Error al cargar las imagenes', isLoading: false });
    }
  },
}));
