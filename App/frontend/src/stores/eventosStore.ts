import { create } from 'zustand';
import { Evento, EVENTOS_MOCK } from '../mocks/eventos.mock';
import { eventosService } from '../services/eventosService';

interface EventosState {
  eventos: Evento[];
  isLoading: boolean;
  error: string | null;
  fetchEventos: () => Promise<void>;
  addEvento: (evento: Omit<Evento, 'id'>) => void;
  updateEvento: (id: number, data: Partial<Evento>) => void;
  deleteEvento: (id: number) => void;
}

export const useEventosStore = create<EventosState>((set) => ({
  eventos: [],
  isLoading: false,
  error: null,
  fetchEventos: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await eventosService.getEventos({ estado: 'confirmado' })
      if (data && data.length > 0) {
        set({ eventos: data, isLoading: false })
      } else {
        set({ eventos: EVENTOS_MOCK.filter((e) => e.estado === 'publicado'), isLoading: false })
      }
    } catch {
      set({ eventos: EVENTOS_MOCK.filter((e) => e.estado === 'publicado'), isLoading: false });
    }
  },
  addEvento: (nuevoEvento) => {
    set((state) => ({
      eventos: [
        ...state.eventos,
        {
          ...nuevoEvento,
          id: Math.max(...state.eventos.map((e) => e.id), 0) + 1,
        },
      ],
    }));
  },
  updateEvento: (id, data) => {
    set((state) => ({
      eventos: state.eventos.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
  },
  deleteEvento: (id) => {
    set((state) => ({
      eventos: state.eventos.filter((e) => e.id !== id),
    }));
  },
}));
