import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTestimoniosStore } from '../../stores/testimoniosStore';

const { mockTestimonios } = vi.hoisted(() => {
  const testimonio = {
    id: 1, autor_nombre: 'Lucia Fernandez', autor_carrera: 'Tec. en Desarrollo',
    texto: 'Excelente instituto, muy recomendable', visible: true,
  };
  return {
    mockTestimonios: [
      testimonio,
      { ...testimonio, id: 2, autor_nombre: 'Martin Gomez', texto: 'Muy buena experiencia', visible: false },
    ],
  };
});

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockTestimonios } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

describe('testimoniosStore', () => {
  beforeEach(() => {
    useTestimoniosStore.setState({ testimonios: [], isLoading: false, error: null });
  });

  it('arranca con estado vacio', () => {
    const state = useTestimoniosStore.getState();
    expect(state.testimonios).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchTestimonios carga los testimonios desde la API', async () => {
    await useTestimoniosStore.getState().fetchTestimonios();
    const state = useTestimoniosStore.getState();
    expect(state.testimonios).toHaveLength(2);
    expect(state.testimonios[0].autor_nombre).toBe('Lucia Fernandez');
    expect(state.isLoading).toBe(false);
  });

  it('deleteTestimonio saca el testimonio del estado', async () => {
    useTestimoniosStore.setState({ testimonios: mockTestimonios });
    await useTestimoniosStore.getState().deleteTestimonio(1);
    const state = useTestimoniosStore.getState();
    expect(state.testimonios).toHaveLength(1);
    expect(state.testimonios[0].id).toBe(2);
  });

  it('fetchTestimonios maneja error de API', async () => {
    const api = (await import('../../services/api')).default;
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error al cargar' } } });
    await useTestimoniosStore.getState().fetchTestimonios();
    const state = useTestimoniosStore.getState();
    expect(state.error).toBe('Error al cargar');
    expect(state.isLoading).toBe(false);
  });
});
