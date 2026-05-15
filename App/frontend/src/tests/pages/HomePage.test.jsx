import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../services/carrerasService', () => ({
  carrerasService: { getAll: vi.fn().mockResolvedValue({ data: { data: [] } }), getBySlug: vi.fn() },
}))

vi.mock('../../../services/noticiasService', () => ({
  noticiasService: { getAll: vi.fn().mockResolvedValue({ data: { data: [] } }), getBySlug: vi.fn() },
}))

import HomePage from '../../pages/public/HomePage/HomePage'

describe('HomePage', () => {
  it('renderiza las secciones principales', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByText('Instituto de Formacion Tecnica Superior N° 29')).toBeInTheDocument()
    expect(screen.getByText('1500+')).toBeInTheDocument()
    expect(screen.getByText('Lo que dicen nuestros estudiantes')).toBeInTheDocument()
  })
})
