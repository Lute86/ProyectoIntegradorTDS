import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockCarrerasStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockCarrerasStore }))

const mockGetAll = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { data: [] } }))
vi.mock('../../services/horariosService', () => ({
  horariosService: { getAll: mockGetAll },
}))

import EstudiantesPage from '../../pages/public/EstudiantesPage/EstudiantesPage'

const MOCK_CARRERAS = [
  { id: 1, nombre: 'Desarrollo de Software', slug: 'ds' },
  { id: 2, nombre: 'Seguridad Informatica', slug: 'si' },
]

describe('EstudiantesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCarrerasStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      fetchCarreras: vi.fn(),
    })
  })

  it('renderiza el titulo principal', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByText('Portal del Estudiante')).toBeInTheDocument()
  })

  it('renderiza el selector de carreras', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByText('Desarrollo de Software')).toBeInTheDocument()
    expect(screen.getByText('Seguridad Informatica')).toBeInTheDocument()
  })

  it('fetchea horarios al seleccionar una carrera', async () => {
    mockGetAll.mockResolvedValue({ data: { data: [{ id: 1, comision: 'A', carrera_materia: { cuatrimestre: 1, materia: { nombre: 'Prog I' } }, dia: 'Lunes', horario: '18:00', aula: '201', profesor: 'Juan' }] } })
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    const selects = screen.getAllByDisplayValue('Seleccionar')
    fireEvent.change(selects[0], { target: { value: '1' } })
    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith({ carrera_id: 1 })
    })
  })
})
