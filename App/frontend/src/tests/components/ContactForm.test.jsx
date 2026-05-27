import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContactForm from '../../pages/public/ContactoPage/ContactForm'

describe('ContactForm', () => {
  it('llama onSubmit con los datos del formulario', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan Perez' } })
    fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'juan@test.com' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Consulta general' } })
    fireEvent.change(screen.getByPlaceholderText('Escribi tu mensaje...'), { target: { value: 'Hola, quiero info sobre las carreras.' } })
    fireEvent.click(screen.getByText('Enviar mensaje'))

    await screen.findByText('Enviar mensaje')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('muestra errores de validacion al enviar vacio', async () => {
    render(<ContactForm onSubmit={vi.fn()} />)
    fireEvent.click(screen.getByText('Enviar mensaje'))

    expect(await screen.findByText('Minimo 2 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Email invalido')).toBeInTheDocument()
    expect(screen.getByText('Minimo 10 caracteres')).toBeInTheDocument()
  })

  it('deshabilita el boton cuando esta cargando', () => {
    render(<ContactForm onSubmit={vi.fn()} isLoading />)
    expect(screen.getByText('Enviando...')).toBeDisabled()
  })
})
