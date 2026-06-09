import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockAddEvento = vi.fn()
const mockUpdateEvento = vi.fn()
const mockOnClose = vi.fn()

vi.mock('../../stores/eventosStore', () => ({
  useEventosStore: vi.fn(() => ({
    addEvento: mockAddEvento,
    updateEvento: mockUpdateEvento,
  })),
}))

vi.mock('../../components/ui/RichEditor', () => ({
  default: ({ value, onChange }) => (
    <textarea data-testid="rich-editor-mock" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))

import EventoFormModal from '../../components/admin/EventoFormModal'

const eventoMock = {
  id: 1, nombre: 'Jornada de Prueba', descripcion: '<p>Descripcion del evento de prueba</p>',
  fecha: '2026-07-15', ubicacion: 'Presencial', estado: 'confirmado',
}

describe('EventoFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(<EventoFormModal isOpen={false} onClose={mockOnClose} eventoToEdit={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renderiza los campos en modo creacion', () => {
    render(<EventoFormModal isOpen={true} onClose={mockOnClose} eventoToEdit={null} />)
    expect(screen.getByText('Nuevo Evento')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nombre del evento')).toBeInTheDocument()
    expect(screen.getByText('Crear evento')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('precarga datos en modo edicion', () => {
    render(<EventoFormModal isOpen={true} onClose={mockOnClose} eventoToEdit={eventoMock} />)
    expect(screen.getByText('Editar Evento')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Jornada de Prueba')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Presencial')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-07-15')).toBeInTheDocument()
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument()
  })

  it('llama a onClose al hacer clic en Cancelar', async () => {
    render(<EventoFormModal isOpen={true} onClose={mockOnClose} eventoToEdit={null} />)
    await userEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('envia los datos correctos al crear un evento', async () => {
    render(<EventoFormModal isOpen={true} onClose={mockOnClose} eventoToEdit={null} />)

    await userEvent.type(screen.getByPlaceholderText('Nombre del evento'), 'Evento de prueba creado')
    const dateInput = document.querySelector('input[type="date"]')
    fireEvent.change(dateInput, { target: { value: '2026-08-15' } })
    fireEvent.change(screen.getByTestId('rich-editor-mock'), { target: { value: '<p>Descripcion del evento</p>' } })
    await userEvent.type(screen.getByPlaceholderText('Ej: Presencial, Virtual, Aula 3'), 'Virtual')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'confirmado' } })

    await userEvent.click(screen.getByText('Crear evento'))

    expect(mockAddEvento).toHaveBeenCalledTimes(1)
    expect(mockAddEvento).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Evento de prueba creado',
      ubicacion: 'Virtual',
      estado: 'confirmado',
    }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('llama a updateEvento al editar un evento', async () => {
    render(<EventoFormModal isOpen={true} onClose={mockOnClose} eventoToEdit={eventoMock} />)

    await userEvent.clear(screen.getByDisplayValue('Jornada de Prueba'))
    await userEvent.type(screen.getByDisplayValue(''), 'Evento modificado')
    await userEvent.click(screen.getByText('Guardar cambios'))

    expect(mockUpdateEvento).toHaveBeenCalledTimes(1)
    expect(mockUpdateEvento).toHaveBeenCalledWith(1, expect.objectContaining({
      nombre: 'Evento modificado',
    }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
