import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/materiasStore', () => ({ default: mockStore }))

import AdminMateriasPage from '../../pages/admin/MateriasPage/MateriasPage'

const MOCK_MATERIAS = [
  { id: 1, nombre: 'Programacion I', descripcion: 'Intro a la programacion' },
  { id: 2, nombre: 'Matematica', descripcion: 'Analisis matematico' },
]

describe('AdminMateriasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.mockReturnValue({
      materias: MOCK_MATERIAS,
      loading: false,
      error: null,
      fetchMaterias: vi.fn(),
      deleteMateria: vi.fn(),
    })
  })

  it('renderiza el listado de materias', () => {
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    expect(screen.getByText('Gestion de Materias')).toBeInTheDocument()
    expect(screen.getByText('Programacion I')).toBeInTheDocument()
    expect(screen.getByText('Matematica')).toBeInTheDocument()
  })

  it('elimina una materia exitosamente', async () => {
    const deleteMateria = vi.fn().mockResolvedValue()
    mockStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria,
    })
    window.confirm = vi.fn(() => true)
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByText('Eliminar')[0])
    await waitFor(() => {
      expect(deleteMateria).toHaveBeenCalledWith(1)
    })
  })

  it('muestra mensaje de error si falla la eliminacion', async () => {
    const deleteMateria = vi.fn().mockRejectedValue({
      response: { data: { message: 'Tiene asignaciones en carreras' } },
    })
    mockStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria,
    })
    window.confirm = vi.fn(() => true)
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByText('Eliminar')[0])
    await waitFor(() => {
      expect(screen.getByText('Tiene asignaciones en carreras')).toBeInTheDocument()
    })
  })
})
