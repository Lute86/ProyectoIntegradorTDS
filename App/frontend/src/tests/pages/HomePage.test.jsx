import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const MOCK_CARRERAS = [
  { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', duracion: 2, modalidad: 'presencial', descripcion: 'Aprende a programar.', color: '#3B82F6' },
  { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', duracion: 2, modalidad: 'virtual', descripcion: 'Ciberseguridad.', color: '#059669' },
  { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', duracion: 2, modalidad: 'hibrida', descripcion: 'Datos.', color: '#D97706' },
]

const MOCK_NOTICIAS = [
  { id: 1, titulo: 'Noticia 1', slug: 'noticia-1', contenido: '<p>Contenido</p>', categoria: { id: 1, nombre: 'Novedades', slug: 'novedades' }, autor: { id: 1, nombre: 'Admin', apellido: 'User' }, fecha_publicacion: '2026-01-01', estado: 'publicado' },
]

const MOCK_TESTIMONIOS = [
  { id: 1, texto: 'Testimonio 1', autor_nombre: 'Ana', autor_carrera: 'DS', iniciales: 'AN' },
]

const mockCarrerasStore = vi.hoisted(() => vi.fn())
const mockTestimoniosStore = vi.hoisted(() => vi.fn())

vi.mock('../../stores/carrerasStore', () => ({ default: mockCarrerasStore }))
vi.mock('../../stores/testimoniosStore', () => ({ useTestimoniosStore: mockTestimoniosStore }))

import { useNoticiasStore } from '../../stores/noticiasStore'
import HomePage from '../../pages/public/HomePage/HomePage'

describe('HomePage', () => {
  beforeEach(() => {
    mockCarrerasStore.mockReturnValue({
      carreras: MOCK_CARRERAS,
      loading: false,
      error: null,
      fetchCarreras: vi.fn(),
    })
    mockTestimoniosStore.mockReturnValue({
      testimonios: MOCK_TESTIMONIOS,
      fetchTestimonios: vi.fn(),
    })
    useNoticiasStore.setState({ noticias: MOCK_NOTICIAS, fetchNoticias: vi.fn(), isLoading: false })
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
