import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../services/api', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
  return { default: mockApi }
})

import api from '../../services/api'
import useMateriasStore from '../../stores/materiasStore'

const mockMateria = { id: 1, nombre: 'Programacion I', descripcion: 'Intro' }

describe('materiasStore', () => {
  beforeEach(() => {
    useMateriasStore.setState({
      materias: [], asignaciones: [], loading: false, error: null, _lastFetched: 0,
    })
    vi.clearAllMocks()
  })

  it('fetchMaterias respeta TTL y no refetchea dentro de 30s', async () => {
    useMateriasStore.setState({ materias: [mockMateria], _lastFetched: Date.now() - 5000 })
    await useMateriasStore.getState().fetchMaterias()
    expect(api.get).not.toHaveBeenCalled()
  })

  it('addAsignacion relanza error en caso de fallo', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Error de prueba' } } })
    await expect(useMateriasStore.getState().addAsignacion(1, { materia_id: 1 })).rejects.toThrow()
    const state = useMateriasStore.getState()
    expect(state.error).toBe('Error de prueba')
  })

  it('removeAsignacion relanza error en caso de fallo', async () => {
    api.delete.mockRejectedValueOnce(new Error('Network error'))
    await expect(useMateriasStore.getState().removeAsignacion(1, 1)).rejects.toThrow()
  })
})
