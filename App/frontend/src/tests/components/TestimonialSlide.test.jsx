import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TestimonialSlide from '../../components/public/TestimonialsCarousel/TestimonialSlide'

const testimonio = {
  id: 1, texto: 'Muy buena institucion', autor_nombre: 'Juan Perez',
  autor_carrera: 'Desarrollo de Software', iniciales: 'JP',
}

describe('TestimonialSlide', () => {
  it('renderiza texto, autor y carrera', () => {
    render(<TestimonialSlide testimonio={testimonio} />)
    expect(screen.getByText(/Muy buena institucion/)).toBeInTheDocument()
    expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    expect(screen.getByText('Desarrollo de Software')).toBeInTheDocument()
  })

  it('aplica line-clamp-2 al texto', () => {
    render(<TestimonialSlide testimonio={testimonio} />)
    const texto = screen.getByText(/Muy buena institucion/)
    expect(texto.className).toContain('line-clamp-2')
  })
})
