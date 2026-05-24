import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../services/carrerasService', () => {
  const mockCarreras = [
    { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', titulo_oficial: 'Tecnico Superior en Desarrollo de Software', modalidad: 'Presencial', duracion: '3 años', descripcion: '...', descripcion_larga: '...', icono: 'DS', color: 'from-blue-400 to-blue-600', requisitos: ['Tener secundario completo'], horarios: [{ dia: 'Lunes', horario: '18-22', aula: '1' }], materias: [] },
    { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', titulo_oficial: 'Tecnico Superior en Seguridad Informatica', modalidad: 'Distancia', duracion: '3 años', descripcion: '...', icono: 'SI', color: 'from-green-400 to-green-600', requisitos: [], horarios: [], materias: [] },
    { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', titulo_oficial: 'Tecnico Superior en Analisis de Datos', modalidad: 'Semipresencial', duracion: '3 años', descripcion: '...', icono: 'AD', color: 'from-purple-400 to-purple-600', requisitos: [], horarios: [], materias: [] },
  ]

  return {
    carrerasService: {
      getAll: vi.fn().mockResolvedValue({ data: { data: mockCarreras } }),
      getBySlug: vi.fn((slug) => {
        const found = mockCarreras.find((c) => c.slug === slug)
        if (!found) return Promise.reject({ response: { data: { message: 'Carrera no encontrada' } } })
        return Promise.resolve({ data: { data: found } })
      }),
    }
  }
})

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
  it('renderiza el titulo h1 y el nombre oficial', async () => {
    renderWithRoute('desarrollo-de-software')
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Desarrollo de Software' })).toBeInTheDocument()
    })
    expect(screen.getAllByText('Tecnico Superior en Desarrollo de Software').length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza las tabs', async () => {
    renderWithRoute('desarrollo-de-software')
    await waitFor(() => {
      expect(screen.getByText('Descripcion')).toBeInTheDocument()
    })
    expect(screen.getByText('Materias')).toBeInTheDocument()
    expect(screen.getByText('Requisitos')).toBeInTheDocument()
    expect(screen.getByText('Horarios')).toBeInTheDocument()
  })

  it('muestra las otras carreras en la sidebar', async () => {
    renderWithRoute('desarrollo-de-software')
    await waitFor(() => {
      expect(screen.getByText('Otras Carreras')).toBeInTheDocument()
    })
    expect(screen.getByText('Seguridad Informatica')).toBeInTheDocument()
    expect(screen.getByText('Analisis de Datos')).toBeInTheDocument()
  })

  it('muestra mensaje si la carrera no existe', async () => {
    renderWithRoute('carrera-inexistente')
    await waitFor(() => {
      expect(screen.getByText('Carrera no encontrada')).toBeInTheDocument()
    })
  })
})
