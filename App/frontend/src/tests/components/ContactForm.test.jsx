import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContactForm from '../../components/public/ContactForm/ContactForm'

describe('ContactForm', () => {
  it('renderiza el formulario con todos los campos', () => {
    render(<ContactForm />)
    expect(screen.getByText('Envia tu consulta')).toBeInTheDocument()
    expect(screen.getByText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Asunto')).toBeInTheDocument()
    expect(screen.getByText('Mensaje')).toBeInTheDocument()
    expect(screen.getByText('Enviar mensaje')).toBeInTheDocument()
  })
})
