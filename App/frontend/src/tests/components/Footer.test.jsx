import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const DEFAULT_CONFIG = {
  siteName: 'IFTS 29',
  siteSubtitle: 'Instituto de Formacion Tecnico Superior',
  contactEmail: 'contacto@ifts29.edu.ar',
  contactPhone: '+54 11 1234-5678',
  address: 'Av. Siempre Viva 123, CABA',
  footerText: '2026 IFTS 29 - Todos los derechos reservados.',
  socialLinks: {
    instagram: 'https://instagram.com/ifts29',
    facebook: 'https://facebook.com/ifts29',
  },
}

let mockConfig = { ...DEFAULT_CONFIG }

vi.mock('../../stores/siteConfigStore', () => ({
  useSiteConfigStore: vi.fn(() => ({ config: mockConfig })),
}))

import Footer from '../../components/layout/PublicLayout/Footer/Footer'

describe('Footer', () => {
  beforeEach(() => {
    mockConfig = { ...DEFAULT_CONFIG }
  })

  it('renderiza el nombre del sitio y subtitulo', () => {
    render(<Footer />)
    expect(screen.getByText('IFTS 29')).toBeInTheDocument()
    expect(screen.getByText('Instituto de Formacion Tecnico Superior')).toBeInTheDocument()
  })

  it('renderiza informacion de contacto', () => {
    render(<Footer />)
    expect(screen.getByText('contacto@ifts29.edu.ar')).toBeInTheDocument()
    expect(screen.getByText('Av. Siempre Viva 123, CABA')).toBeInTheDocument()
    expect(screen.getByText('+54 11 1234-5678')).toBeInTheDocument()
  })

  it('renderiza enlaces de redes sociales cuando estan configurados', () => {
    render(<Footer />)
    const instagram = screen.getByText('Instagram')
    const facebook = screen.getByText('Facebook')
    expect(instagram).toBeInTheDocument()
    expect(facebook).toBeInTheDocument()
    expect(instagram.closest('a')).toHaveAttribute('href', 'https://instagram.com/ifts29')
    expect(facebook.closest('a')).toHaveAttribute('href', 'https://facebook.com/ifts29')
  })

  it('no renderiza "Enlaces Rapidos"', () => {
    render(<Footer />)
    expect(screen.queryByText('Enlaces Rapidos')).not.toBeInTheDocument()
    expect(screen.queryByText('Carreras')).not.toBeInTheDocument()
  })

  it('muestra "Sin redes configuradas" cuando no hay URLs', () => {
    mockConfig.socialLinks = { instagram: '', facebook: '' }
    render(<Footer />)
    expect(screen.getByText('Sin redes configuradas')).toBeInTheDocument()
    expect(screen.queryByText('Instagram')).not.toBeInTheDocument()
    expect(screen.queryByText('Facebook')).not.toBeInTheDocument()
  })

  it('renderiza el footerText en la barra inferior', () => {
    render(<Footer />)
    expect(screen.getByText('2026 IFTS 29 - Todos los derechos reservados.')).toBeInTheDocument()
  })
})
