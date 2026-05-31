import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const MOCK_CARRERAS = [
  { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', duracion: 2, modalidad: 'presencial', descripcion: 'Aprende a programar.', color: '#3B82F6' },
  { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', duracion: 2, modalidad: 'virtual', descripcion: 'Ciberseguridad.', color: '#059669' },
  { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', duracion: 2, modalidad: 'hibrida', descripcion: 'Datos.', color: '#D97706' },
]

const mockStore = vi.hoisted(() => vi.fn())
vi.mock('../../stores/carrerasStore', () => ({ default: mockStore }))

import HomePage from '../../pages/public/HomePage/HomePage'

describe('HomePage', () => {
  beforeEach(() => {
    mockStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      loading: false,
      error: null,
      fetchCarreras: vi.fn(),
    })
  })

  it('renderiza todas las secciones', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByText('Instituto de Formacion Tecnica Superior N° 29')).toBeInTheDocument()
    expect(screen.getByText('1500+')).toBeInTheDocument()
    expect(screen.getByText('Nuestras Carreras')).toBeInTheDocument()
    expect(screen.getByText('Ultimas Noticias')).toBeInTheDocument()
    expect(screen.getByText('Lo que dicen nuestros estudiantes')).toBeInTheDocument()
  })
})
