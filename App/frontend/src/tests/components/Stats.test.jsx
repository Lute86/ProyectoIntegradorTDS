import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Stats from '../../components/public/Stats/Stats'

const items = [
  { id: 1, valor: '100+', label: 'Test 1' },
  { id: 2, valor: '200+', label: 'Test 2' },
]

describe('Stats', () => {
  it('renderiza todos los items', () => {
    render(<Stats items={items} />)
    expect(screen.getByText('100+')).toBeInTheDocument()
    expect(screen.getByText('200+')).toBeInTheDocument()
  })

  it('no renderiza nada si items esta vacio', () => {
    const { container } = render(<Stats items={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('no renderiza nada si items es null', () => {
    const { container } = render(<Stats items={null} />)
    expect(container.innerHTML).toBe('')
  })
})
