import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NewsCard from '../../components/public/NewsSection/NewsCard'

const noticia = {
  id: 1, slug: 'test-slug', titulo: 'Noticia de prueba',
  categoria: 'Inscripciones', resumen: 'Resumen de prueba', fecha: '15 Mar 2026',
}

describe('NewsCard', () => {
  it('renderiza titulo, categoria y fecha', () => {
    render(<MemoryRouter><NewsCard noticia={noticia} /></MemoryRouter>)
    expect(screen.getByText('Noticia de prueba')).toBeInTheDocument()
    expect(screen.getByText('Inscripciones')).toBeInTheDocument()
    expect(screen.getByText('15 Mar 2026')).toBeInTheDocument()
  })

  it('linkea al detalle de la noticia', () => {
    render(<MemoryRouter><NewsCard noticia={noticia} /></MemoryRouter>)
    expect(screen.getByText(/Leer más/).closest('a')).toHaveAttribute('href', '/noticias/test-slug')
  })
})
