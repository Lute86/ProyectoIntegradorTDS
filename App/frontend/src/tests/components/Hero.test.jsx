import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '../../components/public/Hero/Hero'

describe('Hero', () => {
  it('renderiza titulo y subtitulo', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('Instituto de Formacion Tecnica Superior N° 29')).toBeInTheDocument()
    expect(screen.getByText(/compromiso social/)).toBeInTheDocument()
  })

  it('renderiza dos botones CTA', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('Ver Carreras')).toBeInTheDocument()
    expect(screen.getByText('Aula Virtual')).toBeInTheDocument()
  })

  it('los botones linkean a las rutas correctas', () => {
    render(<MemoryRouter><Hero /></MemoryRouter>)
    expect(screen.getByText('Ver Carreras').closest('a')).toHaveAttribute('href', '/carreras')
    expect(screen.getByText('Aula Virtual').closest('a')).toHaveAttribute('href', 'https://aulasvirtuales.bue.edu.ar/')
  })
})
