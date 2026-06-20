import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockCarreras } = vi.hoisted(() => ({
  mockCarreras: [
    { id: 1, nombre: 'Tec. en Desarrollo', slug: 'tec-desarrollo', modalidad: 'presencial', activa: true },
    { id: 2, nombre: 'Tec. en Gestion', slug: 'tec-gestion', modalidad: 'virtual', activa: true },
  ],
}))

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { data: mockCarreras } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import useCarrerasStore from '../../stores/carrerasStore'

describe('carrerasStore', () => {
  beforeEach(() => {
    useCarrerasStore.setState({ carreras: [], selectedCarrera: null, loading: false, error: null })
  })

  it('arranca con estado vacio', () => {
    const state = useCarrerasStore.getState()
    expect(state.carreras).toEqual([])
    expect(state.selectedCarrera).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('fetchCarreras carga las carreras desde la API', async () => {
    await useCarrerasStore.getState().fetchCarreras()
    const state = useCarrerasStore.getState()
    expect(state.carreras).toHaveLength(2)
    expect(state.carreras[0].nombre).toBe('Tec. en Desarrollo')
    expect(state.loading).toBe(false)
  })

  it('fetchCarreras maneja error de API', async () => {
    const api = (await import('../../services/api')).default
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Error de conexion' } } })
    await useCarrerasStore.getState().fetchCarreras()
    const state = useCarrerasStore.getState()
    expect(state.error).toBe('Error de conexion')
    expect(state.loading).toBe(false)
  })

  it('setSelectedCarrera actualiza la carrera seleccionada', () => {
    useCarrerasStore.getState().setSelectedCarrera(mockCarreras[0])
    expect(useCarrerasStore.getState().selectedCarrera?.nombre).toBe('Tec. en Desarrollo')
  })
})
