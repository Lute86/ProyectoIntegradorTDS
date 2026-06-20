import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewsSection from '../../components/public/NewsSection/NewsSection'

const noticias = [
  { id: 1, slug: 'a', titulo: 'Noticia 1', categoria: 'Evento', resumen: 'Resumen 1', fecha: '1 Ene 2026' },
  { id: 2, slug: 'b', titulo: 'Noticia 2', categoria: 'Examenes', resumen: 'Resumen 2', fecha: '2 Ene 2026' },
  { id: 3, slug: 'c', titulo: 'Noticia 3', categoria: 'Becas', resumen: 'Resumen 3', fecha: '3 Ene 2026' },
  { id: 4, slug: 'd', titulo: 'Noticia 4', categoria: 'Tecnologia', resumen: 'Resumen 4', fecha: '4 Ene 2026' },
]

describe('NewsSection', () => {
  it('renderiza titulo y link a todas las noticias', () => {
    render(<MemoryRouter><NewsSection noticias={noticias} /></MemoryRouter>)
    expect(screen.getByText('Ultimas Noticias')).toBeInTheDocument()
    expect(screen.getByText('Ver todas las noticias')).toBeInTheDocument()
  })

  it('muestra hasta 6 noticias en carrusel', () => {
    render(<MemoryRouter><NewsSection noticias={noticias} /></MemoryRouter>)
    expect(screen.getByText('Noticia 1')).toBeInTheDocument()
    expect(screen.getByText('Noticia 2')).toBeInTheDocument()
    expect(screen.getByText('Noticia 3')).toBeInTheDocument()
    expect(screen.getByText('Noticia 4')).toBeInTheDocument()
  })

  it('no renderiza nada si la lista esta vacia', () => {
    const { container } = render(<MemoryRouter><NewsSection noticias={[]} /></MemoryRouter>)
    expect(container.innerHTML).toBe('')
  })
})
