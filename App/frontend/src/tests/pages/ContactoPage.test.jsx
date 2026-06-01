import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockPost = vi.hoisted(() => vi.fn())

vi.mock('../../services/api', () => ({
  default: { post: mockPost },
}))

import ContactoPage from '../../pages/public/ContactoPage/ContactoPage'

function llenarFormulario() {
  fireEvent.change(screen.getByPlaceholderText('Tu nombre'), { target: { value: 'Juan Perez' } })
  fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'juan@test.com' } })
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Consulta general' } })
  fireEvent.change(screen.getByPlaceholderText('Escribi tu mensaje...'), { target: { value: 'Hola, quiero informacion sobre las carreras que ofrecen.' } })
  fireEvent.click(screen.getByText('Enviar mensaje'))
}

describe('ContactoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el formulario y la info de contacto', () => {
    render(<ContactoPage />)
    expect(screen.getByText('Envia tu consulta')).toBeInTheDocument()
    expect(screen.getByText('Direccion')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('llama api.post con los datos del formulario', async () => {
    mockPost.mockResolvedValue({ data: { success: true } })
    render(<ContactoPage />)
    llenarFormulario()

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/consultas', {
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        asunto: 'Consulta general',
        mensaje: 'Hola, quiero informacion sobre las carreras que ofrecen.',
      })
    })
  })

  it('muestra mensaje de exito al enviar', async () => {
    mockPost.mockResolvedValue({ data: { success: true } })
    render(<ContactoPage />)
    llenarFormulario()

    expect(await screen.findByText('Consulta enviada exitosamente')).toBeInTheDocument()
  })

  it('muestra mensaje de error si falla el envio', async () => {
    mockPost.mockRejectedValue({
      response: { data: { message: 'Demasiadas consultas, intente mas tarde' } },
    })
    render(<ContactoPage />)
    llenarFormulario()

    expect(await screen.findByText('Demasiadas consultas, intente mas tarde')).toBeInTheDocument()
  })

  it('muestra error generico si la respuesta no tiene mensaje', async () => {
    mockPost.mockRejectedValue({ response: {} })
    render(<ContactoPage />)
    llenarFormulario()

    expect(await screen.findByText('Error al enviar la consulta')).toBeInTheDocument()
  })

  it('deshabilita el boton mientras esta cargando', async () => {
    mockPost.mockImplementation(() => new Promise(() => {}))
    render(<ContactoPage />)
    llenarFormulario()

    expect(await screen.findByText('Enviando...')).toBeInTheDocument()
  })
})
