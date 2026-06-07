import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useConsultasStore } from '../../stores/consultasStore';

const { mockConsultas } = vi.hoisted(() => {
  const consulta = {
    id: 1, nombre: 'Juan Perez', email: 'juan@test.com',
    asunto: 'Consulta general', mensaje: 'Hola, quiero info sobre las carreras',
    respondido: false, respuesta: null, createdAt: '2026-06-01T10:00:00Z', updatedAt: '2026-06-01T10:00:00Z',
  };
  return {
    mockConsultas: [
      consulta,
      { ...consulta, id: 2, nombre: 'Maria Lopez', asunto: 'Inscripciones', respondido: true, respuesta: 'Gracias' },
    ]
  };
});

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockConsultas } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

describe('consultasStore', () => {
  beforeEach(() => {
    useConsultasStore.setState({
      consultas: [], unreadCount: 0, isLoading: false, error: null,
    });
  });

  it('arranca con estado vacio', () => {
    const state = useConsultasStore.getState();
    expect(state.consultas).toEqual([]);
    expect(state.unreadCount).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchConsultas carga las consultas desde la API', async () => {
    await useConsultasStore.getState().fetchConsultas();
    const state = useConsultasStore.getState();
    expect(state.consultas).toHaveLength(2);
    expect(state.consultas[0].nombre).toBe('Juan Perez');
    expect(state.isLoading).toBe(false);
  });

  it('eliminarConsulta saca la consulta del estado', async () => {
    useConsultasStore.setState({ consultas: mockConsultas });
    await useConsultasStore.getState().eliminarConsulta(1);
    const state = useConsultasStore.getState();
    expect(state.consultas).toHaveLength(1);
    expect(state.consultas[0].id).toBe(2);
  });

  it('fetchConsultas maneja error de API', async () => {
    const api = (await import('../../services/api')).default;
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error al cargar' } } });
    await useConsultasStore.getState().fetchConsultas();
    const state = useConsultasStore.getState();
    expect(state.error).toBe('Error al cargar');
    expect(state.isLoading).toBe(false);
  });
});
