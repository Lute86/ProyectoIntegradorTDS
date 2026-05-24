import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewsSidebar from '../../components/public/NewsSidebar/NewsSidebar'

const mockNoticias = [
  { id: 1, slug: 'n1', titulo: 'Noticia 1', categoria: 'Inscripciones', fecha: '10 Mar 2026' },
  { id: 2, slug: 'n2', titulo: 'Noticia 2', categoria: 'Exámenes', fecha: '5 Mar 2026' },
  { id: 3, slug: 'n3', titulo: 'Noticia 3', categoria: 'Evento', fecha: '1 Mar 2026' },
  { id: 4, slug: 'n4', titulo: 'Noticia 4', categoria: 'Tecnología', fecha: '20 Feb 2026' },
  { id: 5, slug: 'n5', titulo: 'Noticia 5', categoria: 'Becas', fecha: '15 Feb 2026' },
]

describe('NewsSidebar', () => {
  it('renderiza categorias con contador', () => {
    render(<MemoryRouter><NewsSidebar noticias={mockNoticias} selectedCategory="" onCategoryChange={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('Inscripciones')).toBeInTheDocument()
    expect(screen.getByText('Exámenes')).toBeInTheDocument()
    expect(screen.getByText('Evento')).toBeInTheDocument()
    expect(screen.getByText('Tecnología')).toBeInTheDocument()
    expect(screen.getByText('Becas')).toBeInTheDocument()
  })

  it('renderiza ultimas noticias', () => {
    render(<MemoryRouter><NewsSidebar noticias={mockNoticias} selectedCategory="" onCategoryChange={vi.fn()} /></MemoryRouter>)
    expect(screen.getByText('Noticia 1')).toBeInTheDocument()
    expect(screen.getByText('Noticia 2')).toBeInTheDocument()
  })
})
