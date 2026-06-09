import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockAddTestimonio = vi.fn()
const mockUpdateTestimonio = vi.fn()
const mockOnClose = vi.fn()

vi.mock('../../stores/testimoniosStore', () => ({
  useTestimoniosStore: vi.fn(() => ({
    addTestimonio: mockAddTestimonio,
    updateTestimonio: mockUpdateTestimonio,
  })),
}))

import TestimonioFormModal from '../../components/admin/TestimonioFormModal'

const testimonioMock = {
  id: 1, autor_nombre: 'Lucia Fernandez', autor_carrera: 'Tec. en Desarrollo',
  texto: 'Excelente instituto, muy recomendable', visible: true,
}

describe('TestimonioFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(<TestimonioFormModal isOpen={false} onClose={mockOnClose} testimonioToEdit={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renderiza los campos en modo creacion', () => {
    render(<TestimonioFormModal isOpen={true} onClose={mockOnClose} testimonioToEdit={null} />)
    expect(screen.getByText('Nuevo Testimonio')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre del autor')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej: Tecnicatura en Desarrollo de Software')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Texto del testimonio...')).toBeInTheDocument()
    expect(screen.getByText('Crear testimonio')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('precarga datos en modo edicion', () => {
    render(<TestimonioFormModal isOpen={true} onClose={mockOnClose} testimonioToEdit={testimonioMock} />)
    expect(screen.getByText('Editar Testimonio')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Lucia Fernandez')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Tec. en Desarrollo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Excelente instituto, muy recomendable')).toBeInTheDocument()
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument()
  })

  it('llama a onClose al hacer clic en Cancelar', async () => {
    render(<TestimonioFormModal isOpen={true} onClose={mockOnClose} testimonioToEdit={null} />)
    await userEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('envia los datos correctos al crear un testimonio', async () => {
    render(<TestimonioFormModal isOpen={true} onClose={mockOnClose} testimonioToEdit={null} />)

    await userEvent.type(screen.getByPlaceholderText('Nombre del autor'), 'Nuevo Autor')
    await userEvent.type(screen.getByPlaceholderText('Ej: Tecnicatura en Desarrollo de Software'), 'Tec. en Sistemas')
    await userEvent.type(screen.getByPlaceholderText('Texto del testimonio...'), 'Un texto de testimonio largo para pasar la validacion de 10 caracteres')

    await userEvent.click(screen.getByText('Crear testimonio'))

    expect(mockAddTestimonio).toHaveBeenCalledTimes(1)
    expect(mockAddTestimonio).toHaveBeenCalledWith({
      autor_nombre: 'Nuevo Autor',
      autor_carrera: 'Tec. en Sistemas',
      texto: 'Un texto de testimonio largo para pasar la validacion de 10 caracteres',
      visible: true,
    })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('llama a updateTestimonio al editar', async () => {
    render(<TestimonioFormModal isOpen={true} onClose={mockOnClose} testimonioToEdit={testimonioMock} />)

    await userEvent.clear(screen.getByDisplayValue('Lucia Fernandez'))
    await userEvent.type(screen.getByDisplayValue(''), 'Lucia Modificada')
    await userEvent.click(screen.getByText('Guardar cambios'))

    expect(mockUpdateTestimonio).toHaveBeenCalledTimes(1)
    expect(mockUpdateTestimonio).toHaveBeenCalledWith(1, expect.objectContaining({
      autor_nombre: 'Lucia Modificada',
    }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
