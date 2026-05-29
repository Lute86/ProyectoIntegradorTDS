import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CareerCard from '../../components/public/CareerCards/CareerCard'

const carrera = {
  id: 1, slug: 'test', nombre: 'Test Carrera', duracion: 2,
  modalidad: 'presencial', descripcion: 'Descripcion de prueba',
  color: '#3B82F6',
}

describe('CareerCard', () => {
  it('renderiza nombre, duracion y descripcion', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('Test Carrera')).toBeInTheDocument()
    expect(screen.getByText('2 anos')).toBeInTheDocument()
    expect(screen.getByText('Descripcion de prueba')).toBeInTheDocument()
  })

  it('renderiza iniciales del nombre', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('TC')).toBeInTheDocument()
  })

  it('linkea a /carreras/:slug', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('Ver mas →').closest('a')).toHaveAttribute('href', '/carreras/test')
  })
})
