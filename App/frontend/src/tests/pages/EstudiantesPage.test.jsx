import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EstudiantesPage from '../../pages/public/EstudiantesPage/EstudiantesPage'

describe('EstudiantesPage', () => {
  it('renderiza titulo y portales', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Portal del Estudiante' })).toBeInTheDocument()
    expect(screen.getByText('Aula Virtual')).toBeInTheDocument()
    expect(screen.getByText('Horarios')).toBeInTheDocument()
    expect(screen.getByText('Examenes')).toBeInTheDocument()
    expect(screen.getByText('Portal SIU')).toBeInTheDocument()
  })

  it('renderiza tabla de horarios', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByText('Programacion I')).toBeInTheDocument()
    expect(screen.getByText('Matematica')).toBeInTheDocument()
  })

  it('renderiza enlaces utiles', () => {
    render(<MemoryRouter><EstudiantesPage /></MemoryRouter>)
    expect(screen.getByText('Enlaces Utiles')).toBeInTheDocument()
  })
})
