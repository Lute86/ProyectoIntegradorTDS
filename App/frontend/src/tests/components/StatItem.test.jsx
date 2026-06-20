import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatItem from '../../components/public/Stats/StatItem'

describe('StatItem', () => {
  it('renderiza valor y label', async () => {
    render(<StatItem valor="+1500" label="Estudiantes" />)
    expect(await screen.findByText('+1500', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('Estudiantes')).toBeInTheDocument()
  })
})
