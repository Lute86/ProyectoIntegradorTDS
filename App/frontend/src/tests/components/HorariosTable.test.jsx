import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HorariosTable from '../../components/public/HorariosTable/HorariosTable'

const horarios = [
  { dia: 'Lunes', horario: '18:00 - 22:00', aula: 'Aula 5' },
  { dia: 'Miercoles', horario: '18:00 - 22:00', aula: 'Aula 5' },
]

describe('HorariosTable', () => {
  it('renderiza encabezados de la tabla', () => {
    render(<HorariosTable horarios={horarios} />)
    expect(screen.getByText('Dia')).toBeInTheDocument()
    expect(screen.getByText('Horario')).toBeInTheDocument()
    expect(screen.getByText('Aula')).toBeInTheDocument()
  })

  it('renderiza cada fila de horario', () => {
    render(<HorariosTable horarios={horarios} />)
    expect(screen.getByText('Lunes')).toBeInTheDocument()
    expect(screen.getByText('Miercoles')).toBeInTheDocument()
  })

  it('muestra mensaje si no hay horarios', () => {
    render(<HorariosTable horarios={[]} />)
    expect(screen.getByText('No hay horarios disponibles.')).toBeInTheDocument()
  })
})
