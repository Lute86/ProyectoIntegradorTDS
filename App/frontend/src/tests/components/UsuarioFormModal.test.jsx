import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockAddUsuario = vi.fn()
const mockUpdateUsuario = vi.fn()
const mockOnClose = vi.fn()

vi.mock('../../stores/usuariosStore', () => ({
  useUsuariosStore: vi.fn(() => ({
    addUsuario: mockAddUsuario,
    updateUsuario: mockUpdateUsuario,
  })),
}))

import UsuarioFormModal from '../../components/admin/UsuarioFormModal'

const usuarioMock = {
  id: 1, nombre: 'Andres', apellido: 'Garcia', email: 'admin@ifts29.edu.ar',
  rol: 'admin', activo: true, avatar_url: null, ultimo_acceso: '2026-01-01',
}

describe('UsuarioFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(<UsuarioFormModal isOpen={false} onClose={mockOnClose} usuarioToEdit={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renderiza los campos en modo creacion', () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={null} />)
    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese el nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ingrese el apellido')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('correo@ifts29.edu.ar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Minimo 8 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Crear usuario')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('precarga datos en modo edicion', () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={usuarioMock} />)
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Andres')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Garcia')).toBeInTheDocument()
    expect(screen.getByDisplayValue('admin@ifts29.edu.ar')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Minimo 8 caracteres')).not.toBeInTheDocument()
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument()
  })

  it('llama a onClose al hacer clic en Cancelar', async () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={null} />)
    await userEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('llama a onClose al hacer clic en la X', async () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={null} />)
    await userEvent.click(screen.getByText('X'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('envia los datos correctos al crear un usuario', async () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={null} />)

    await userEvent.type(screen.getByPlaceholderText('Ingrese el nombre'), 'Nuevo')
    await userEvent.type(screen.getByPlaceholderText('Ingrese el apellido'), 'Usuario')
    await userEvent.type(screen.getByPlaceholderText('correo@ifts29.edu.ar'), 'nuevo@test.com')
    await userEvent.type(screen.getByPlaceholderText('Minimo 8 caracteres'), 'Admin1234')
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'profesor' } })

    await userEvent.click(screen.getByText('Crear usuario'))

    expect(mockAddUsuario).toHaveBeenCalledTimes(1)
    expect(mockAddUsuario).toHaveBeenCalledWith({
      nombre: 'Nuevo', apellido: 'Usuario', email: 'nuevo@test.com',
      rol: 'profesor', password: 'Admin1234', activo: true,
    })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('llama a updateUsuario al editar un usuario', async () => {
    render(<UsuarioFormModal isOpen={true} onClose={mockOnClose} usuarioToEdit={usuarioMock} />)

    await userEvent.clear(screen.getByDisplayValue('Andres'))
    await userEvent.type(screen.getByDisplayValue(''), 'Andres Modificado')
    await userEvent.click(screen.getByText('Guardar cambios'))

    expect(mockUpdateUsuario).toHaveBeenCalledTimes(1)
    expect(mockUpdateUsuario).toHaveBeenCalledWith(1, {
      nombre: 'Andres Modificado', apellido: 'Garcia',
      email: 'admin@ifts29.edu.ar', rol: 'admin',
    })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
