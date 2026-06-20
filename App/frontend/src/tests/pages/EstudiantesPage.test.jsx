import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockCarrerasStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockCarrerasStore }))

const mockGetAll = vi.hoisted(() => vi.fn())
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
    mockGetAll.mockResolvedValue({ data: { data: [{ id: 1, comision: 'A', carreraMateria: { cuatrimestre: 1, materia: { nombre: 'Prog I' } }, dia: 'Lunes', horario: '18:00', aula: '201', profesor: 'Juan' }] } })
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    fireEvent.change(screen.getByDisplayValue('Seleccionar'), { target: { value: '1' } })
    await waitFor(() => {
      expect(mockGetAll).toHaveBeenCalledWith({ carrera_id: 1 })
    })
  })

  it('no muestra el select de comision al inicio', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.queryByText('Comision')).not.toBeInTheDocument()
  })

  it('muestra el select de comision al elegir carrera con comisiones', async () => {
    mockGetAll.mockResolvedValue({ data: { data: [{ id: 1, comision: 'A', carreraMateria: { cuatrimestre: 1, materia: { nombre: 'Prog I' } }, dia: 'Lunes', horario: '18:00', aula: '201', profesor: 'Juan' }] } })
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    fireEvent.change(screen.getByDisplayValue('Seleccionar'), { target: { value: '1' } })
    await waitFor(() => {
      expect(screen.getByText('Comision')).toBeInTheDocument()
    })
  })

  it('muestra select de cuatrimestre al elegir comision', async () => {
    mockGetAll.mockResolvedValue({ data: { data: [{ id: 1, comision: 'A', carreraMateria: { cuatrimestre: 1, materia: { nombre: 'Prog I' } }, dia: 'Lunes', horario: '18:00', aula: '201', profesor: 'Juan' }] } })
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    fireEvent.change(screen.getByDisplayValue('Seleccionar'), { target: { value: '1' } })
    await waitFor(() => {
      expect(screen.getByText('Comision')).toBeInTheDocument()
    })
    const combos = screen.getAllByRole('combobox')
    fireEvent.change(combos[1], { target: { value: 'A' } })
    await waitFor(() => {
      expect(screen.getByText('Cuatrimestre')).toBeInTheDocument()
    })
  })

  it('muestra mensaje inicial "Selecciona una carrera"', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByText('Selecciona una carrera para comenzar.')).toBeInTheDocument()
  })

  it('muestra mensaje "No hay horarios disponibles" si carrera sin comisiones', async () => {
    mockGetAll.mockResolvedValue({ data: { data: [] } })
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    fireEvent.change(screen.getByDisplayValue('Seleccionar'), { target: { value: '1' } })
    await waitFor(() => {
      expect(screen.getByText('No hay horarios disponibles para esta carrera.')).toBeInTheDocument()
    })
  })
})
