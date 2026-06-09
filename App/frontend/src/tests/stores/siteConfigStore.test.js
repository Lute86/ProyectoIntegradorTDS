import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockConfig, mockDefaultSections } = vi.hoisted(() => {
  const config = {
    site_name: 'IFTS 29', site_subtitle: 'Test', contact_email: 'test@test.com',
    contact_phone: '123', address: 'Calle 123', seo_description: 'Desc', footer_text: 'Footer',
    colors: { primary: '#000', secondary: '#fff', accent: '#f00', surface: '#eee', background: '#fff', text: '#111' },
    sections: [{ id: 'hero', visible: true, order: 1 }],
    social_links: { instagram: 'https://ig.com/test', facebook: 'https://fb.com/test' },
    theme_preset: 'moderno',
  }
  return {
    mockConfig: config,
    mockDefaultSections: [{ id: 'hero', visible: true, order: 1 }],
  }
})

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

vi.mock('../../services/siteConfigService', () => ({
  siteConfigService: {
    getConfig: vi.fn(),
  },
}))

import { useSiteConfigStore } from '../../stores/siteConfigStore'

const getDefaultConfig = () => useSiteConfigStore.getState().config

describe('siteConfigStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useSiteConfigStore.getState().resetConfig()
  })

  it('tiene configuracion por defecto al iniciar', () => {
    const state = useSiteConfigStore.getState()
    expect(state.config).toBeDefined()
    expect(state.config.siteName).toBe('IFTS 29')
    expect(state.config.colors.primary).toBe('#2563eb')
    expect(state.isLoading).toBe(false)
    expect(state.isDirty).toBe(false)
  })

  it('updateConfig modifica el estado local', () => {
    useSiteConfigStore.getState().updateConfig({ siteName: 'Nuevo Nombre' })
    expect(useSiteConfigStore.getState().config.siteName).toBe('Nuevo Nombre')
    expect(useSiteConfigStore.getState().isDirty).toBe(true)
  })

  it('updateColors modifica solo los colores', () => {
    useSiteConfigStore.getState().updateColors({ primary: '#ff0000' })
    expect(useSiteConfigStore.getState().config.colors.primary).toBe('#ff0000')
    expect(useSiteConfigStore.getState().config.colors.secondary).toBe('#10b981')
  })

  it('fetchConfig carga config desde la API y mapea social_links', async () => {
    const svc = (await import('../../services/siteConfigService')).siteConfigService
    svc.getConfig.mockResolvedValueOnce({ data: { data: mockConfig } })

    await useSiteConfigStore.getState().fetchConfig()

    const state = useSiteConfigStore.getState()
    expect(state.config.siteName).toBe('IFTS 29')
    expect(state.config.socialLinks.instagram).toBe('https://ig.com/test')
    expect(state.isLoading).toBe(false)
  })

  it('saveConfig envia PUT con payload transformado', async () => {
    const api = (await import('../../services/api')).default
    api.put.mockResolvedValueOnce({})

    await useSiteConfigStore.getState().saveConfig()

    expect(api.put).toHaveBeenCalledTimes(1)
    const payload = api.put.mock.calls[0][1]
    expect(payload.site_name).toBe('IFTS 29')
    expect(payload.social_links).toBeDefined()
  })
})
