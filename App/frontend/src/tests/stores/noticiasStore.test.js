import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNoticiasStore } from '../../stores/noticiasStore';

const mockNoticia = {
  id: 1, titulo: 'Test', slug: 'test', contenido: '<p>Contenido</p>',
  categoria_id: 1, autor_id: 1, estado: 'publicado', fecha_publicacion: '2026-01-01',
  categoria: { id: 1, nombre: 'Novedades', slug: 'novedades', color: '#000' },
  autor: { id: 1, nombre: 'Admin', apellido: 'User', avatar_url: null },
};

const mockCategoria = { id: 1, nombre: 'Novedades', slug: 'novedades', color: '#000' };

vi.mock('../../services/noticiasService', () => {
  const mockNoticia = {
    id: 1, titulo: 'Test', slug: 'test', contenido: '<p>Contenido</p>',
    categoria_id: 1, autor_id: 1, estado: 'publicado', fecha_publicacion: '2026-01-01',
    categoria: { id: 1, nombre: 'Novedades', slug: 'novedades', color: '#000' },
    autor: { id: 1, nombre: 'Admin', apellido: 'User', avatar_url: null },
  };
  const mockCategoria = { id: 1, nombre: 'Novedades', slug: 'novedades', color: '#000' };
  return {
    noticiasService: {
      getAll: vi.fn().mockResolvedValue({ data: { data: [mockNoticia], total: 1, page: 1, limit: 10, totalPages: 1 } }),
      getBySlug: vi.fn().mockResolvedValue({ data: { data: mockNoticia } }),
      getCategories: vi.fn().mockResolvedValue({ data: { data: [mockCategoria] } }),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    },
  };
});

describe('noticiasStore', () => {
  beforeEach(() => {
    useNoticiasStore.setState({
      noticias: [], selectedNoticia: null, categorias: [],
      isLoading: false, error: null, _lastFetched: 0,
    });
  });

  it('inicia con estado vacio', () => {
    const state = useNoticiasStore.getState();
    expect(state.noticias).toEqual([]);
    expect(state.selectedNoticia).toBeNull();
    expect(state.categorias).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchNoticias carga noticias y actualiza _lastFetched', async () => {
    const store = useNoticiasStore.getState();
    await store.fetchNoticias();
    const state = useNoticiasStore.getState();
    expect(state.noticias).toHaveLength(1);
    expect(state.noticias[0].titulo).toBe('Test');
    expect(state._lastFetched).toBeGreaterThan(0);
    expect(state.isLoading).toBe(false);
  });

  it('fetchNoticias respeta TTL y no refetchea dentro de 30s', async () => {
    const { noticiasService } = await import('../../services/noticiasService');
    noticiasService.getAll.mockClear();
    useNoticiasStore.setState({ noticias: [mockNoticia], _lastFetched: Date.now() - 5000 });
    const store = useNoticiasStore.getState();
    await store.fetchNoticias();
    expect(noticiasService.getAll).not.toHaveBeenCalled();
  });

  it('fetchNoticiaBySlug busca por slug y setea selectedNoticia', async () => {
    const store = useNoticiasStore.getState();
    await store.fetchNoticiaBySlug('test');
    const state = useNoticiasStore.getState();
    expect(state.selectedNoticia).not.toBeNull();
    expect(state.selectedNoticia?.slug).toBe('test');
    expect(state.isLoading).toBe(false);
  });

  it('setSelectedNoticia actualiza la noticia seleccionada', () => {
    useNoticiasStore.getState().setSelectedNoticia(mockNoticia);
    expect(useNoticiasStore.getState().selectedNoticia?.titulo).toBe('Test');
  });

  it('fetchNoticias maneja error del servicio', async () => {
    const { noticiasService } = await import('../../services/noticiasService');
    noticiasService.getAll.mockRejectedValueOnce({ response: { data: { message: 'Error de API' } } });
    const store = useNoticiasStore.getState();
    await store.fetchNoticias();
    const state = useNoticiasStore.getState();
    expect(state.error).toBe('Error de API');
    expect(state.isLoading).toBe(false);
  });
});
