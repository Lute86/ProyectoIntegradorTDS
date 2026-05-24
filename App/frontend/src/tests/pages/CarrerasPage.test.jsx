import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CarrerasPage from '../../pages/public/CarrerasPage/CarrerasPage'

describe('CarrerasPage', () => {
  it('renderiza el titulo h1', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Carreras' })).toBeInTheDocument()
  })

  it('renderiza filtros de modalidad', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    const filterButtons = screen.getAllByRole('button')
    expect(filterButtons.map((b) => b.textContent)).toEqual(
      expect.arrayContaining(['Todas', 'Presencial', 'Distancia', 'Semipresencial']),
    )
  })

  it('renderiza las 3 carreras en el listado', () => {
    render(<MemoryRouter><CarrerasPage /></MemoryRouter>)
    const cards = screen.getAllByRole('heading', { level: 3 })
    expect(cards.map((h) => h.textContent)).toEqual(
      expect.arrayContaining(['Desarrollo de Software', 'Seguridad Informatica', 'Analisis de Datos']),
    )
  })
})
