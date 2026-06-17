import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockUseParams = vi.hoisted(() => vi.fn(() => ({ id: '1' })))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: mockUseParams }
})

const mockCarrerasStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockCarrerasStore }))

const mockMateriasStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/materiasStore', () => ({ default: mockMateriasStore }))

const mockUsuariosStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/usuariosStore', () => ({ useUsuariosStore: mockUsuariosStore }))

const mockComisionCreate = vi.hoisted(() => vi.fn())
const mockComisionGetAll = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { data: [] } }))
const mockAssignMaterias = vi.hoisted(() => vi.fn())
vi.mock('../../services/comisionesService', () => ({
  comisionesService: { getAll: mockComisionGetAll, create: mockComisionCreate, update: vi.fn(), delete: vi.fn(), assignMaterias: mockAssignMaterias, removeMateria: vi.fn() },
}))

const mockCreate = vi.hoisted(() => vi.fn())
const mockUpdate = vi.hoisted(() => vi.fn())
const mockGetAll = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { data: [] } }))
vi.mock('../../services/horariosService', () => ({
  horariosService: { getAll: mockGetAll, create: mockCreate, update: mockUpdate, delete: vi.fn() },
}))

import CarreraDetailAdmin from '../../pages/admin/CarrerasPage/CarreraDetailAdmin'

const MOCK_CARRERA = {
  id: 1, nombre: 'Desarrollo de Software', duracion: 2, modalidad: 'presencial',
  descripcion: 'Carrera de prueba', activa: true,
  carreraMaterias: [
    { id: 1, cuatrimestre: 1, carga_horaria_semanal: 6, materia: { id: 1, nombre: 'Programacion I' } },
    { id: 2, cuatrimestre: 1, carga_horaria_semanal: 4, materia: { id: 2, nombre: 'Matematica' } },
  ],
}

const MOCK_COMISION = {
  id: 99, nombre: '1A', carrera_id: 1, anio_lectivo: 2024, semestre: 1,
  carrerasMaterias: [
    { id: 1, cuatrimestre: 1, carga_horaria_semanal: 6, materia: { id: 1, nombre: 'Programacion I' } },
    { id: 2, cuatrimestre: 1, carga_horaria_semanal: 4, materia: { id: 2, nombre: 'Matematica' } },
  ],
}

const MOCK_HORARIO_EXISTENTE = {
  id: 50,
  comision_id: 99,
  carrera_materia_id: 1,
  dia: 'Lunes',
  horario: '10:00-12:00',
  aula: '101',
  profesor: ''
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/carreras/1']}>
      <CarreraDetailAdmin />
    </MemoryRouter>,
  )
}

describe('CarreraDetailAdmin - Horarios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ id: '1' })
    mockCarrerasStore.mockReturnValue({
      selectedCarrera: MOCK_CARRERA,
      loading: false,
      fetchCarreraById: vi.fn(),
    })
    mockMateriasStore.mockReturnValue({
      materias: [], fetchMaterias: vi.fn(), addAsignacion: vi.fn(), removeAsignacion: vi.fn(),
    })
    mockUsuariosStore.mockReturnValue({
      usuarios: [], fetchUsuarios: vi.fn(), isLoading: false,
    })
    mockComisionCreate.mockReset()
    mockComisionGetAll.mockResolvedValue({ data: { data: [] } })
    mockGetAll.mockResolvedValue({ data: { data: [] } })
  })

  it('renderiza las pestanas Materias y Horarios por Comision', () => {
    renderPage()
    expect(screen.getByText('Materias')).toBeInTheDocument()
    expect(screen.getByText('Horarios por Comision')).toBeInTheDocument()
  })

  it('abre modal de nueva comision y la crea con nombre combinado', async () => {
    mockComisionGetAll.mockResolvedValue({ data: { data: [] } })
    mockComisionCreate.mockResolvedValue({ data: { data: { id: 200 } } })
    renderPage()
    fireEvent.click(screen.getByText('Horarios por Comision'))
    await screen.findByText('+ Nueva Comision')
    fireEvent.click(screen.getByText('+ Nueva Comision'))
    expect(screen.getByText('Nueva Comision')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Ej: A, B, C')
    fireEvent.change(input, { target: { value: 'A' } })
    fireEvent.click(screen.getByText('Crear'))
    await waitFor(() => {
      expect(mockComisionCreate).toHaveBeenCalledWith(expect.objectContaining({
        carrera_id: 1, nombre: '1A', semestre: 1,
      }))
    })
    expect(mockAssignMaterias).toHaveBeenCalledWith(200, [1, 2])
  })

  it('llama a horariosService.create al cargar horarios con datos validos', async () => {
    mockComisionGetAll.mockResolvedValue({ data: { data: [MOCK_COMISION] } })
    mockCreate.mockResolvedValue({ data: { data: { id: 101 } } })
    renderPage()
    fireEvent.click(screen.getByText('Horarios por Comision'))
    const comBtn = await screen.findByText('A')
    fireEvent.click(comBtn)
    const selects = screen.getAllByRole('combobox')
    const diaSelects = selects.filter((s) => s.tagName === 'SELECT' && !s.value)
    diaSelects.forEach((s) => fireEvent.change(s, { target: { value: 'Lunes' } }))
    const timeInputs = document.querySelectorAll('input[type="time"]')
    timeInputs.forEach((i, idx) => fireEvent.change(i, { target: { value: idx % 2 === 0 ? '18:00' : '20:00' } }))
    const aulas = screen.getAllByPlaceholderText('Ej: 201')
    aulas.forEach((a) => fireEvent.change(a, { target: { value: '201' } }))
    fireEvent.click(screen.getByText('Guardar Horarios'))

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        carrera_materia_id: 1, comision_id: 99, dia: 'Lunes', horario: '18:00-20:00', aula: '201',
      }))
    })
  })

  it('permite guardar aunque haya filas vacias y muestra mensaje informativo', async () => {
    mockComisionGetAll.mockResolvedValue({ data: { data: [MOCK_COMISION] } })
    renderPage()
    fireEvent.click(screen.getByText('Horarios por Comision'))
    fireEvent.click(await screen.findByText('A'))
    fireEvent.click(screen.getByText('Guardar Horarios'))

    await waitFor(() => {
      expect(screen.getByText(/Completa al menos dia y horario/)).toBeInTheDocument()
    })
  })

  it('muestra mensaje placeholder si no hay comision seleccionada', async () => {
    renderPage()
    fireEvent.click(screen.getByText('Horarios por Comision'))
    await waitFor(() => {
      expect(screen.getByText('No hay comisiones para este cuatrimestre. Creá una nueva.')).toBeInTheDocument()
    })
  })

  it('muestra error parcial cuando algunas filas fallan al guardar', async () => {
    mockComisionGetAll.mockResolvedValue({ data: { data: [MOCK_COMISION] } })
    mockCreate.mockRejectedValueOnce(new Error('Error de red'))
      .mockResolvedValueOnce({ data: { data: { id: 102 } } })
    // Mock horarios existentes para forzar modo individual
    mockGetAll.mockResolvedValue({ 
      data: { 
        data: [{
          id: 52,
          comision_id: 99,
          carrera_materia_id: 1,
          dia: 'Lunes',
          horario: '10:00-12:00',
          aula: '101'
        }]
      } 
    })
    renderPage()
    fireEvent.click(screen.getByText('Horarios por Comision'))
    fireEvent.click(await screen.findByText('A'))

    const selects = screen.getAllByRole('combobox').filter((s) => s.tagName === 'SELECT' && !s.value)
    selects.forEach((s) => fireEvent.change(s, { target: { value: 'Lunes' } }))
    const timeInputs = document.querySelectorAll('input[type="time"]')
    timeInputs.forEach((i, idx) => fireEvent.change(i, { target: { value: idx % 2 === 0 ? '18:00' : '20:00' } }))
    const aulas = screen.getAllByPlaceholderText('Ej: 201')
    aulas.forEach((a) => fireEvent.change(a, { target: { value: '201' } }))
    fireEvent.click(screen.getByText('Guardar Horarios'))

    await waitFor(() => {
      expect(screen.getByText(/1 guardado, 1 fallaron/)).toBeInTheDocument()
    })
  })
})
