import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../services/carrerasService', () => ({
  carrerasService: { getAll: vi.fn().mockResolvedValue({ data: { data: [{ id: 1, nombre: 'Test', slug: 'test', duracion: '2 anos', descripcion: 'Test', descripcion_larga: 'Test', icono: 'DS', color: 'from-blue-400 to-blue-600', modalidad: 'Presencial' }] } }), getBySlug: vi.fn() },
}))

vi.mock('../../services/noticiasService', () => ({
  noticiasService: { getAll: vi.fn().mockResolvedValue({ data: { data: [{ id: 1, titulo: 'Noticia Test', slug: 'test', categoria: 'Evento', resumen: 'Test', contenido: 'Test', autor: 'Admin', fecha: '2025-01-01' }] } }), getBySlug: vi.fn() },
}))

import HomePage from '../../pages/public/HomePage/HomePage'

describe('HomePage', () => {
  it('renderiza las secciones principales', async () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByText('Instituto de Formacion Tecnica Superior N° 29')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Nuestras Carreras')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('Ultimas Noticias')).toBeInTheDocument()
    })
  })
})
