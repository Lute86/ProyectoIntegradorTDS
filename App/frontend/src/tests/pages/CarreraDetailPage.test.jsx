import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const MOCK_CARRERAS = [
  { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', duracion: 2, modalidad: 'presencial', descripcion: 'Aprende a programar.', color: '#3B82F6', materias: [{ nombre: 'Programacion I', cuatrimestre: 1 }] },
  { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', duracion: 2, modalidad: 'virtual', descripcion: 'Ciberseguridad.', color: '#059669' },
  { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', duracion: 2, modalidad: 'hibrida', descripcion: 'Datos.', color: '#D97706' },
]

const mockStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockStore }))

import CarreraDetailPage from '../../pages/public/CarrerasPage/CarreraDetailPage'

function renderWithRoute(slug) {
  return render(
    <MemoryRouter initialEntries={[`/carreras/${slug}`]}>
      <Routes>
        <Route path="/carreras/:slug" element={<CarreraDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CarreraDetailPage', () => {
  beforeEach(() => {
    mockStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      selectedCarrera: null,
      loading: false,
      error: null,
      fetchCarreras: vi.fn(),
      fetchCarreraBySlug: vi.fn(),
    })
  })

  it('renderiza el titulo h1 y el nombre oficial', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByRole('heading', { level: 1, name: 'Desarrollo de Software' })).toBeInTheDocument()
    expect(screen.getAllByText('Tecnicatura en Desarrollo de Software').length).toBe(2)
  })

  it('renderiza las tabs', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByText('Descripcion')).toBeInTheDocument()
    expect(screen.getByText('Materias')).toBeInTheDocument()
    expect(screen.getByText('Requisitos')).toBeInTheDocument()
    expect(screen.getByText('Horarios')).toBeInTheDocument()
  })

  it('muestra las otras carreras en la sidebar', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByText('Otras Carreras')).toBeInTheDocument()
    expect(screen.getByText('Seguridad Informatica')).toBeInTheDocument()
    expect(screen.getByText('Analisis de Datos')).toBeInTheDocument()
  })

  it('muestra mensaje si la carrera no existe', () => {
    renderWithRoute('carrera-inexistente')
    expect(screen.getByText('Carrera no encontrada')).toBeInTheDocument()
  })
})
