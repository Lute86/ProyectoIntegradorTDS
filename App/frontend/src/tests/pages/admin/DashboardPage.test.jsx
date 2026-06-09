import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}))

vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('API no disponible')),
  },
}))

import DashboardPage from '../../../pages/admin/DashboardPage/DashboardPage.tsx'

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('se renderiza sin crashear', () => {
    const { container } = render(<DashboardPage />)
    expect(container).toBeDefined()
  })

  it('muestra el titulo Dashboard', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
