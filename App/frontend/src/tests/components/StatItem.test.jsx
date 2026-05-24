import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatItem from '../../components/public/Stats/StatItem'

describe('StatItem', () => {
  it('renderiza valor y label', () => {
    render(<StatItem valor="1500+" label="Estudiantes" />)
    expect(screen.getByText('1500+')).toBeInTheDocument()
    expect(screen.getByText('Estudiantes')).toBeInTheDocument()
  })
})
