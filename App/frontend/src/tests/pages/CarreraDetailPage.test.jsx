import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CarreraDetailPage from '../../pages/public/CarrerasPage/CarreraDetailPage'

function renderWithRoute(slug) {
  return render(
    <MemoryRouter initialEntries={[`/carreras/${slug}`]}>
      <Routes>
        <Route path="/carreras/:slug" element={<CarreraDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CarreraDetailPage', () => {
  it('renderiza el titulo h1 y el nombre oficial', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByRole('heading', { level: 1, name: 'Desarrollo de Software' })).toBeInTheDocument()
    expect(screen.getAllByText('Tecnico Superior en Desarrollo de Software').length).toBe(2)
  })

  it('renderiza las tabs', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByText('Descripcion')).toBeInTheDocument()
    expect(screen.getByText('Materias')).toBeInTheDocument()
    expect(screen.getByText('Requisitos')).toBeInTheDocument()
    expect(screen.getByText('Horarios')).toBeInTheDocument()
  })

  it('muestra las otras carreras en la sidebar', () => {
    renderWithRoute('desarrollo-de-software')
    expect(screen.getByText('Otras Carreras')).toBeInTheDocument()
    expect(screen.getByText('Seguridad Informatica')).toBeInTheDocument()
    expect(screen.getByText('Analisis de Datos')).toBeInTheDocument()
  })

  it('muestra mensaje si la carrera no existe', () => {
    renderWithRoute('carrera-inexistente')
    expect(screen.getByText('Carrera no encontrada')).toBeInTheDocument()
  })
})
