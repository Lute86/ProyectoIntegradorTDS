import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewsSidebar from '../../pages/public/NoticiasPage/NewsSidebar'

const categorias = [
  { nombre: 'Inscripciones', count: 5 },
  { nombre: 'Examenes', count: 3 },
]

const destacadas = [
  { slug: 'noticia-1', titulo: 'Primera noticia' },
  { slug: 'noticia-2', titulo: 'Segunda noticia' },
  { slug: 'noticia-3', titulo: 'Tercera noticia' },
]

describe('NewsSidebar', () => {
  it('renderiza categorias con contador', () => {
    render(<MemoryRouter><NewsSidebar categorias={categorias} /></MemoryRouter>)
    expect(screen.getByText('Inscripciones')).toBeInTheDocument()
    expect(screen.getByText('Examenes')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('muestra "Sin categorias" cuando el array esta vacio', () => {
    render(<MemoryRouter><NewsSidebar categorias={[]} /></MemoryRouter>)
    expect(screen.getByText('Sin categorias')).toBeInTheDocument()
  })

  it('renderiza noticias destacadas', () => {
    render(<MemoryRouter><NewsSidebar destacadas={destacadas} /></MemoryRouter>)
    expect(screen.getByText('Primera noticia')).toBeInTheDocument()
    expect(screen.getByText('Tercera noticia')).toBeInTheDocument()
  })

  it('muestra "Sin noticias destacadas" cuando el array esta vacio', () => {
    render(<MemoryRouter><NewsSidebar destacadas={[]} /></MemoryRouter>)
    expect(screen.getByText('Sin noticias destacadas')).toBeInTheDocument()
  })

  it('resalta la categoria seleccionada', () => {
    render(<MemoryRouter><NewsSidebar categorias={categorias} selectedCategory="Inscripciones" /></MemoryRouter>)
    const btn = screen.getByText('Inscripciones').closest('button')
    expect(btn.className).toContain('text-blue-700')
  })

  it('llama onCategoryChange al hacer click en categoria', () => {
    const onCategoryChange = vi.fn()
    render(<MemoryRouter><NewsSidebar categorias={categorias} onCategoryChange={onCategoryChange} /></MemoryRouter>)
    fireEvent.click(screen.getByText('Inscripciones'))
    expect(onCategoryChange).toHaveBeenCalledWith('Inscripciones')
  })

  it('los links de destacadas apuntan a /noticias/:slug', () => {
    render(<MemoryRouter><NewsSidebar destacadas={destacadas} /></MemoryRouter>)
    const link = screen.getByText('Primera noticia').closest('a')
    expect(link).toHaveAttribute('href', '/noticias/noticia-1')
  })
})
