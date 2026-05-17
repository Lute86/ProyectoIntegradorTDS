import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TestimonialsCarousel from '../../components/public/TestimonialsCarousel/TestimonialsCarousel'

const testimonios = [
  { id: 1, texto: 'Testimonio uno', autor_nombre: 'Ana', autor_carrera: 'Carrera A', iniciales: 'AN' },
  { id: 2, texto: 'Testimonio dos', autor_nombre: 'Luis', autor_carrera: 'Carrera B', iniciales: 'LU' },
]

describe('TestimonialsCarousel', () => {
  it('renderiza titulo de la seccion', () => {
    render(<TestimonialsCarousel testimonios={testimonios} />)
    expect(screen.getByText('Lo que dicen nuestros estudiantes')).toBeInTheDocument()
  })

  it('muestra el primer testimonio', () => {
    render(<TestimonialsCarousel testimonios={testimonios} />)
    expect(screen.getByText(/Testimonio uno/)).toBeInTheDocument()
  })

  it('no renderiza nada si no hay testimonios', () => {
    const { container } = render(<TestimonialsCarousel testimonios={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('muestra controles de navegacion si hay mas de un testimonio', () => {
    render(<TestimonialsCarousel testimonios={testimonios} />)
    expect(screen.getByLabelText('Anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Siguiente')).toBeInTheDocument()
  })
})
