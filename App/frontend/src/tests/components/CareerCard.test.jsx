import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CareerCard from '../../components/public/CareerCards/CareerCard'

const carrera = {
  id: 1, slug: 'test', nombre: 'Test Carrera', duracion: '2 anos',
  modalidad: 'Presencial', descripcion: 'Descripcion de prueba',
  icono: 'TC', color: 'from-blue-500 to-blue-700', badgeVariant: 'blue',
}

describe('CareerCard', () => {
  it('renderiza nombre, duracion y descripcion', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('Test Carrera')).toBeInTheDocument()
    expect(screen.getByText('2 anos')).toBeInTheDocument()
    expect(screen.getByText('Descripcion de prueba')).toBeInTheDocument()
  })

  it('renderiza icono', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('TC')).toBeInTheDocument()
  })

  it('linkea a /carreras', () => {
    render(<MemoryRouter><CareerCard carrera={carrera} /></MemoryRouter>)
    expect(screen.getByText('Ver mas →').closest('a')).toHaveAttribute('href', '/carreras')
  })
})
