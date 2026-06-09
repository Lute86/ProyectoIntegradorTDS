import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockAddNoticia = vi.fn()
const mockUpdateNoticia = vi.fn()
const mockOnClose = vi.fn()

vi.mock('../../stores/noticiasStore', () => ({
  useNoticiasStore: vi.fn(() => ({
    addNoticia: mockAddNoticia,
    updateNoticia: mockUpdateNoticia,
    categorias: [
      { id: 1, nombre: 'Institucional', slug: 'institucional', color: '#2563eb' },
      { id: 2, nombre: 'Eventos', slug: 'eventos', color: '#10b981' },
    ],
    fetchCategorias: vi.fn(),
  })),
}))

vi.mock('../../components/ui/RichEditor', () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="rich-editor-mock"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Escriba el contenido de la noticia..."
    />
  ),
}))

import NoticiaFormModal from '../../components/admin/NoticiaFormModal'

const noticiaMock = {
  id: 1, titulo: 'Noticia de prueba', slug: 'noticia-de-prueba',
  contenido: '<p>Contenido de prueba para la noticia</p>',
  categoria_id: 1, categoria: 'Institucional', autor_id: 1,
  estado: 'borrador', fecha_publicacion: '2026-01-01',
}

describe('NoticiaFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(<NoticiaFormModal isOpen={false} onClose={mockOnClose} noticiaToEdit={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renderiza los campos en modo creacion', () => {
    render(<NoticiaFormModal isOpen={true} onClose={mockOnClose} noticiaToEdit={null} />)
    expect(screen.getByText('Nueva Noticia')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Titulo de la noticia')).toBeInTheDocument()
    expect(screen.getByText('Crear noticia')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('precarga datos en modo edicion', () => {
    render(<NoticiaFormModal isOpen={true} onClose={mockOnClose} noticiaToEdit={noticiaMock} />)
    expect(screen.getByText('Editar Noticia')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Noticia de prueba')).toBeInTheDocument()
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument()
  })

  it('llama a onClose al hacer clic en Cancelar', async () => {
    render(<NoticiaFormModal isOpen={true} onClose={mockOnClose} noticiaToEdit={null} />)
    await userEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('envia los datos correctos al crear una noticia', async () => {
    render(<NoticiaFormModal isOpen={true} onClose={mockOnClose} noticiaToEdit={null} />)

    await userEvent.type(screen.getByPlaceholderText('Titulo de la noticia'), 'Mi nueva noticia de prueba')
    fireEvent.change(screen.getByTestId('rich-editor-mock'), { target: { value: '<p>Contenido de la noticia creada</p>' } })
    fireEvent.change(document.querySelectorAll('select')[0], { target: { value: '1' } })
    fireEvent.change(document.querySelectorAll('select')[1], { target: { value: 'publicado' } })

    await userEvent.click(screen.getByText('Crear noticia'))

    expect(mockAddNoticia).toHaveBeenCalledTimes(1)
    expect(mockAddNoticia).toHaveBeenCalledWith(expect.objectContaining({
      titulo: 'Mi nueva noticia de prueba',
    }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
