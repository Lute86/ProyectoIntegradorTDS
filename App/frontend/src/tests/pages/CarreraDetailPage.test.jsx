import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

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
