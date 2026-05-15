import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock axios para que la API falle y el store caiga a MOCK_CARRERAS
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn().mockRejectedValue(new Error('API no disponible')),
    post: vi.fn().mockRejectedValue(new Error('API no disponible')),
    put: vi.fn().mockRejectedValue(new Error('API no disponible')),
    delete: vi.fn().mockRejectedValue(new Error('API no disponible')),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  }
  return { default: mockAxios }
})

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
