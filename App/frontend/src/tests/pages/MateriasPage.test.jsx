import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockMateriasStore = vi.hoisted(() => vi.fn())
const mockCarrerasStore = vi.hoisted(() => vi.fn())
const mockApiGet = vi.hoisted(() => vi.fn())
vi.mock('../../stores/materiasStore', () => ({ default: mockMateriasStore }))
vi.mock('../../stores/carrerasStore', () => ({ default: mockCarrerasStore }))
vi.mock('../../services/api', () => ({ default: { get: mockApiGet } }))

import AdminMateriasPage from '../../pages/admin/MateriasPage/MateriasPage'

const MOCK_MATERIAS = [
  { id: 1, nombre: 'Programacion I', descripcion: 'Intro a la programacion' },
  { id: 2, nombre: 'Matematica', descripcion: 'Analisis matematico' },
]

const MOCK_CARRERAS = [
  { id: 1, nombre: 'Desarrollo de Software', activa: true },
  { id: 2, nombre: 'Seguridad Informatica', activa: true },
]

describe('AdminMateriasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApiGet.mockResolvedValue({ data: { data: {} } })
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS,
      loading: false,
      error: null,
      fetchMaterias: vi.fn(),
      deleteMateria: vi.fn(),
      addAsignacion: vi.fn(),
    })
    mockCarrerasStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      loading: false,
      fetchCarreras: vi.fn(),
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
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria,
      addAsignacion: vi.fn(),
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
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria,
      addAsignacion: vi.fn(),
    })
    window.confirm = vi.fn(() => true)
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByText('Eliminar')[0])
    await waitFor(() => {
      expect(screen.getByText('Tiene asignaciones en carreras')).toBeInTheDocument()
    })
  })

  it('muestra la toolbar de seleccion con boton deshabilitado por defecto', () => {
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    expect(screen.getByText('Selecciona una o mas materias para asignar a carrera')).toBeInTheDocument()
    expect(screen.getByText('Asignar a carrera')).toBeDisabled()
  })

  it('abre el modal de asignacion al seleccionar materias', () => {
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getByText('Asignar a carrera'))
    expect(screen.getByText('Asignar materia a carrera')).toBeInTheDocument()
  })

  it('cierra el modal al hacer click en Cancelar', async () => {
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getByText('Asignar a carrera'))
    expect(screen.getByText('Asignar materia a carrera')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancelar'))
    await waitFor(() => {
      expect(screen.queryByText('Asignar materia a carrera')).not.toBeInTheDocument()
    })
  })

  it('asigna una materia a una carrera exitosamente', async () => {
    const addAsignacion = vi.fn().mockResolvedValue({ id: 1 })
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria: vi.fn(), addAsignacion,
    })
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getByText('Asignar a carrera'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '2' } })
    fireEvent.change(screen.getAllByPlaceholderText('4')[0], { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /asignar a desarrollo/i }))
    await waitFor(() => {
      expect(addAsignacion).toHaveBeenCalledWith('1', {
        materia_id: 1,
        cuatrimestre: 2,
        carga_horaria_semanal: 6,
      })
    })
  })

  it('muestra mensaje de exito verde al asignar correctamente', async () => {
    const addAsignacion = vi.fn().mockResolvedValue({ id: 1 })
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria: vi.fn(), addAsignacion,
    })
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getByText('Asignar a carrera'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '2' } })
    fireEvent.change(screen.getAllByPlaceholderText('4')[0], { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /asignar a desarrollo/i }))
    await waitFor(() => {
      expect(screen.getByText('1 materia asignada correctamente.')).toBeInTheDocument()
    })
  })

  it('muestra mensaje de error rojo si la materia ya esta asignada', async () => {
    const addAsignacion = vi.fn().mockRejectedValue({
      response: { data: { message: 'La materia ya esta asignada a esta carrera' } },
    })
    mockMateriasStore.mockReturnValue({
      materias: MOCK_MATERIAS, loading: false, error: null,
      fetchMaterias: vi.fn(), deleteMateria: vi.fn(), addAsignacion,
    })
    render(<MemoryRouter><AdminMateriasPage /></MemoryRouter>)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    fireEvent.click(screen.getByText('Asignar a carrera'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } })
    fireEvent.change(screen.getByPlaceholderText('1'), { target: { value: '2' } })
    fireEvent.change(screen.getAllByPlaceholderText('4')[0], { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /asignar a desarrollo/i }))
    await waitFor(() => {
      expect(screen.getByText('La materia ya esta asignada a esta carrera')).toBeInTheDocument()
    })
  })
})
