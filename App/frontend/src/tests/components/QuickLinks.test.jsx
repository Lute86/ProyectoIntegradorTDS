import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import QuickLinks from '../../pages/public/EstudiantesPage/QuickLinks'

describe('QuickLinks', () => {
  it('renderiza los 6 enlaces por defecto', () => {
    render(<QuickLinks />)
    expect(screen.getByText('Biblioteca Digital')).toBeInTheDocument()
    expect(screen.getByText('Contacto Secretaria')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('no renderiza nada cuando el array esta vacio', () => {
    const { container } = render(<QuickLinks links={[]} />)
    expect(container.innerHTML).toBe('')
  })
})
