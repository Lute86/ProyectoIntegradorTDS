import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUsuariosStore } from '../../stores/usuariosStore';

const { mockUsuarios } = vi.hoisted(() => {
  const usuario = {
    id: 1, nombre: 'Andres', apellido: 'Garcia', email: 'admin@ifts29.edu.ar',
    rol: 'admin', avatar_url: null, activo: true, ultimo_acceso: '2026-06-01T10:00:00Z',
  };
  return {
    mockUsuarios: [
      usuario,
      { ...usuario, id: 2, nombre: 'Maria', apellido: 'Lopez', email: 'maria@test.com', rol: 'profesor' },
    ],
  };
});

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockUsuarios } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
  },
}));

describe('usuariosStore', () => {
  beforeEach(() => {
    useUsuariosStore.setState({ usuarios: [], isLoading: false, error: null });
  });

  it('arranca con estado vacio', () => {
    const state = useUsuariosStore.getState();
    expect(state.usuarios).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchUsuarios carga los usuarios desde la API', async () => {
    await useUsuariosStore.getState().fetchUsuarios();
    const state = useUsuariosStore.getState();
    expect(state.usuarios).toHaveLength(2);
    expect(state.usuarios[0].nombre).toBe('Andres');
    expect(state.isLoading).toBe(false);
  });

  it('deleteUsuario saca el usuario del estado', async () => {
    useUsuariosStore.setState({ usuarios: mockUsuarios });
    await useUsuariosStore.getState().deleteUsuario(1);
    const state = useUsuariosStore.getState();
    expect(state.usuarios).toHaveLength(1);
    expect(state.usuarios[0].id).toBe(2);
  });

  it('fetchUsuarios maneja error de API', async () => {
    const api = (await import('../../services/api')).default;
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error al cargar' } } });
    await useUsuariosStore.getState().fetchUsuarios();
    const state = useUsuariosStore.getState();
    expect(state.error).toBe('Error al cargar');
    expect(state.isLoading).toBe(false);
  });
});
