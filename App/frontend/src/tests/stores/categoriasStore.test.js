import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockCategorias } = vi.hoisted(() => ({
  mockCategorias: [
    { id: 1, nombre: 'Institucional', slug: 'institucional', color: '#2563eb' },
    { id: 2, nombre: 'Eventos', slug: 'eventos', color: '#10b981' },
    { id: 3, nombre: 'Novedades', slug: 'novedades', color: '#f59e0b' },
  ],
}))

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockCategorias } }),
  },
}))

import { useCategoriasStore } from '../../stores/categoriasStore'

describe('categoriasStore', () => {
  beforeEach(() => {
    useCategoriasStore.setState({ categorias: [], isLoading: false, error: null })
  })

  it('arranca con estado vacio', () => {
    const state = useCategoriasStore.getState()
    expect(state.categorias).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('fetchCategorias carga las categorias desde la API', async () => {
    await useCategoriasStore.getState().fetchCategorias()
    const state = useCategoriasStore.getState()
    expect(state.categorias).toHaveLength(3)
    expect(state.categorias[0].nombre).toBe('Institucional')
    expect(state.isLoading).toBe(false)
  })

  it('fetchCategorias maneja error de API', async () => {
    const api = (await import('../../services/api')).default
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error al cargar categorias' } } })
    await useCategoriasStore.getState().fetchCategorias()
    const state = useCategoriasStore.getState()
    expect(state.error).toBe('Error al cargar categorias')
    expect(state.isLoading).toBe(false)
  })
})
