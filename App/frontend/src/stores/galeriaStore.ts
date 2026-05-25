import { create } from 'zustand';
import { GaleriaImagen, GALERIA_MOCK } from '../mocks/galeria.mock';

interface GaleriaState {
  imagenes: GaleriaImagen[];
  isLoading: boolean;
  error: string | null;
  fetchImagenes: () => Promise<void>;
  addImagen: (imagen: Omit<GaleriaImagen, 'id'>) => void;
  deleteImagen: (id: number) => void;
}

export const useGaleriaStore = create<GaleriaState>((set) => ({
  imagenes: [],
  isLoading: false,
  error: null,
  fetchImagenes: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ imagenes: GALERIA_MOCK, isLoading: false });
    } catch {
      set({ error: 'Error al cargar las imagenes', isLoading: false });
    }
  },
  addImagen: (nuevaImagen) => {
    set((state) => ({
      imagenes: [
        ...state.imagenes,
        {
          ...nuevaImagen,
          id: Math.max(...state.imagenes.map((i) => i.id), 0) + 1,
        },
      ],
    }));
  },
  deleteImagen: (id) => {
    set((state) => ({
      imagenes: state.imagenes.filter((i) => i.id !== id),
    }));
  },
}));
