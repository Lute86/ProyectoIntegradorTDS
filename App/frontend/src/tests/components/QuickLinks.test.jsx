import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import QuickLinks from '../../components/public/QuickLinks/QuickLinks'

describe('QuickLinks', () => {
  it('renderiza todos los enlaces', () => {
    render(<MemoryRouter><QuickLinks /></MemoryRouter>)
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument()
    expect(screen.getByText('Becas y Beneficios')).toBeInTheDocument()
    expect(screen.getByText('Reglamento Estudiantil')).toBeInTheDocument()
    expect(screen.getByText('Soporte Tecnico')).toBeInTheDocument()
    expect(screen.getByText('Bolsa de Trabajo')).toBeInTheDocument()
    expect(screen.getByText('Contacto Secretaria')).toBeInTheDocument()
  })
})
