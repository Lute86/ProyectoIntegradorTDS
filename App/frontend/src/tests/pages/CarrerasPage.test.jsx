import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockCarreras = [
  { id: 1, slug: 'desarrollo-de-software', nombre: 'Desarrollo de Software', titulo_oficial: 'Tecnico Superior en Desarrollo de Software', modalidad: 'Presencial', duracion: '3 años', descripcion: '...', icono: 'DS', color: 'from-blue-400 to-blue-600' },
  { id: 2, slug: 'seguridad-informatica', nombre: 'Seguridad Informatica', titulo_oficial: 'Tecnico Superior en Seguridad Informatica', modalidad: 'Distancia', duracion: '3 años', descripcion: '...', icono: 'SI', color: 'from-green-400 to-green-600' },
  { id: 3, slug: 'analisis-de-datos', nombre: 'Analisis de Datos', titulo_oficial: 'Tecnico Superior en Analisis de Datos', modalidad: 'Semipresencial', duracion: '3 años', descripcion: '...', icono: 'AD', color: 'from-purple-400 to-purple-600' },
]

vi.mock('../../services/carrerasService', () => ({
  carrerasService: {
    getAll: vi.fn().mockResolvedValue({ data: { data: mockCarreras } }),
    getBySlug: vi.fn(),
  }
}))

import CarrerasPage from '../../pages/public/CarrerasPage/CarrerasPage'

describe('CarrerasPage', () => {
  it('renderiza el titulo h1', async () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: 'Carreras' })).toBeInTheDocument())
  })

  it('renderiza filtros de modalidad', async () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    await waitFor(() => {
      const filterButtons = screen.getAllByRole('button')
      expect(filterButtons.map((b) => b.textContent)).toEqual(
        expect.arrayContaining(['Todas', 'Presencial', 'Distancia', 'Semipresencial']),
      )
    })
  })

  it('renderiza las 3 carreras en el listado', async () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    await waitFor(() => {
      const cards = screen.getAllByRole('heading', { level: 3 })
      expect(cards.map((h) => h.textContent)).toEqual(
        expect.arrayContaining(['Desarrollo de Software', 'Seguridad Informatica', 'Analisis de Datos']),
      )
    })
  })
})
