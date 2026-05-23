import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CareerCards from '../../components/public/CareerCards/CareerCards'

const carreras = [
  { id: 1, slug: 'a', nombre: 'Carrera A', duracion: 1, modalidad: 'presencial', descripcion: 'Desc A', icono: 'A', color: 'from-blue-500 to-blue-700' },
  { id: 2, slug: 'b', nombre: 'Carrera B', duracion: 2, modalidad: 'virtual', descripcion: 'Desc B', icono: 'B', color: 'from-green-500 to-green-700' },
]

describe('CareerCards', () => {
  it('renderiza titulo de la seccion', () => {
    render(<MemoryRouter><CareerCards carreras={carreras} /></MemoryRouter>)
    expect(screen.getByText('Nuestras Carreras')).toBeInTheDocument()
  })

  it('renderiza todas las carreras', () => {
    render(<MemoryRouter><CareerCards carreras={carreras} /></MemoryRouter>)
    expect(screen.getByText('Carrera A')).toBeInTheDocument()
    expect(screen.getByText('Carrera B')).toBeInTheDocument()
  })

  it('no renderiza nada si la lista esta vacia', () => {
    const { container } = render(<MemoryRouter><CareerCards carreras={[]} /></MemoryRouter>)
    expect(container.innerHTML).toBe('')
  })
})
