import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockConfig = {
  siteName: 'IFTS 29',
  colors: { primary: '#2563eb', secondary: '#10b981', accent: '#f59e0b', background: '#ffffff', text: '#111827', surface: '#f8fafc' },
  typography: { headingFont: 'Inter', bodyFont: 'Inter', baseSize: '16px' },
  layout: 'full-width',
  sections: [{ id: 'hero', visible: true, order: 1 }],
}

vi.mock('../../../stores/siteConfigStore', () => ({
  useSiteConfigStore: vi.fn(() => ({
    config: mockConfig,
    isLoading: false,
    isDirty: false,
    updateColors: vi.fn(),
    saveConfig: vi.fn(),
    fetchConfig: vi.fn(),
  })),
}))

vi.mock('../../../components/ui/ColorPicker', () => ({
  default: ({ label }) => <div>{label}</div>,
}))

vi.mock('../../../components/admin/ThemePresets', () => ({
  default: () => <div>ThemePresets mock</div>,
}))

vi.mock('../../../components/admin/TypographyConfig', () => ({
  default: () => <div>TypographyConfig mock</div>,
}))

vi.mock('../../../components/admin/LayoutSelector', () => ({
  default: () => <div>LayoutSelector mock</div>,
}))

vi.mock('../../../components/admin/SectionManager', () => ({
  default: () => <div>SectionManager mock</div>,
}))

vi.mock('../../../components/admin/PreviewPanel', () => ({
  default: () => <div>PreviewPanel mock</div>,
}))

import PersonalizarPage from '../../../pages/admin/PersonalizarPage/PersonalizarPage.tsx'

describe('PersonalizarPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('se renderiza sin crashear', () => {
    const { container } = render(<PersonalizarPage />)
    expect(container).toBeDefined()
  })

  it('muestra el titulo Personalizar Sitio', () => {
    render(<PersonalizarPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Personalizar Sitio' })).toBeInTheDocument()
  })
})
