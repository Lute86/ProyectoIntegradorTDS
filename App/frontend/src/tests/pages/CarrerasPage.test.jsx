import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const MOCK_CARRERAS = [
  { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', duracion: 2, modalidad: 'presencial', descripcion: 'Aprende a programar aplicaciones web.', color: '#3B82F6' },
  { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', duracion: 2, modalidad: 'virtual', descripcion: 'Especializate en ciberseguridad.', color: '#059669' },
  { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', duracion: 2, modalidad: 'hibrida', descripcion: 'Domina el manejo de datos.', color: '#D97706' },
]

const mockStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockStore }))

import CarrerasPage from '../../pages/public/CarrerasPage/CarrerasPage'

describe('CarrerasPage', () => {
  beforeEach(() => {
    mockStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      loading: false,
      error: null,
      fetchCarreras: vi.fn(),
    })
  })

  it('renderiza el titulo h1', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Carreras' })).toBeInTheDocument()
  })

  it('renderiza filtros de modalidad', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    const filterButtons = screen.getAllByRole('button')
    expect(filterButtons.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['Todas', 'Presencial', 'Virtual', 'Hibrida']),
    )
  })

  it('renderiza las 3 carreras en el listado', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    expect(screen.getByText('Desarrollo de Software')).toBeInTheDocument()
    expect(screen.getByText('Seguridad Informatica')).toBeInTheDocument()
    expect(screen.getByText('Analisis de Datos')).toBeInTheDocument()
  })
})
