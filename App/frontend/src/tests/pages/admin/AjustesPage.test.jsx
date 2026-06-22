import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockConfig = {
  siteName: 'IFTS 29', siteSubtitle: 'Instituto Test', contactEmail: 'test@ifts29.edu.ar',
  contactPhone: '123456', address: 'Calle Falsa 123', seoDescription: 'Descripcion SEO',
  footerText: 'Footer test',
  socialLinks: { instagram: 'https://ig.com/ifts29', facebook: 'https://fb.com/ifts29' },
}

vi.mock('../../../stores/siteConfigStore', () => ({
  useSiteConfigStore: vi.fn(() => ({
    config: mockConfig,
    isLoading: false,
    saveConfig: vi.fn(),
  })),
}))

import AjustesPage from '../../../pages/admin/AjustesPage/AjustesPage.jsx'

describe('AjustesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('se renderiza sin crashear', () => {
    const { container } = render(<AjustesPage />)
    expect(container).toBeDefined()
  })

  it('muestra el titulo Ajustes del Sitio', () => {
    render(<AjustesPage />)
    expect(screen.getByText('Ajustes del Sitio')).toBeInTheDocument()
  })
})
