import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactoPage from '../../pages/public/ContactoPage/ContactoPage'

describe('ContactoPage', () => {
  it('renderiza titulo e info de contacto', () => {
    render(<ContactoPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByText('Direccion')).toBeInTheDocument()
    expect(screen.getAllByText('Email').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Telefono')).toBeInTheDocument()
    expect(screen.getByText('Horario de Atencion')).toBeInTheDocument()
  })

  it('renderiza el formulario de contacto', () => {
    render(<ContactoPage />)
    expect(screen.getByText('Envia tu consulta')).toBeInTheDocument()
  })
})
