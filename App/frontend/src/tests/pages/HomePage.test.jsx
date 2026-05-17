import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../../pages/public/HomePage/HomePage'

describe('HomePage', () => {
  it('renderiza todas las secciones', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByText('Instituto de Formacion Tecnica Superior N° 29')).toBeInTheDocument()
    expect(screen.getByText('1500+')).toBeInTheDocument()
    expect(screen.getByText('Nuestras Carreras')).toBeInTheDocument()
    expect(screen.getByText('Ultimas Noticias')).toBeInTheDocument()
    expect(screen.getByText('Lo que dicen nuestros estudiantes')).toBeInTheDocument()
  })
})
