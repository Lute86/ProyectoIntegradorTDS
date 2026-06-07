import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEventosStore } from '../../stores/eventosStore';

const { mockEventos } = vi.hoisted(() => {
  const evento = {
    id: 1, nombre: 'Jornada de Puertas Abiertas', descripcion: '<p>Evento de prueba</p>',
    fecha: '2026-07-15', ubicacion: 'Presencial', estado: 'confirmado',
  };
  return {
    mockEventos: [
      evento,
      { ...evento, id: 2, nombre: 'Charla IA', fecha: '2026-08-01', ubicacion: 'Virtual', estado: 'pendiente' },
    ],
  };
});

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockEventos } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

describe('eventosStore', () => {
  beforeEach(() => {
    useEventosStore.setState({ eventos: [], isLoading: false, error: null });
  });

  it('arranca con estado vacio', () => {
    const state = useEventosStore.getState();
    expect(state.eventos).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchEventos carga los eventos desde la API', async () => {
    await useEventosStore.getState().fetchEventos();
    const state = useEventosStore.getState();
    expect(state.eventos).toHaveLength(2);
    expect(state.eventos[0].nombre).toBe('Jornada de Puertas Abiertas');
    expect(state.isLoading).toBe(false);
  });

  it('deleteEvento saca el evento del estado', async () => {
    useEventosStore.setState({ eventos: mockEventos });
    await useEventosStore.getState().deleteEvento(1);
    const state = useEventosStore.getState();
    expect(state.eventos).toHaveLength(1);
    expect(state.eventos[0].id).toBe(2);
  });

  it('fetchEventos maneja error de API', async () => {
    const api = (await import('../../services/api')).default;
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error al cargar' } } });
    await useEventosStore.getState().fetchEventos();
    const state = useEventosStore.getState();
    expect(state.error).toBe('Error al cargar');
    expect(state.isLoading).toBe(false);
  });
});
