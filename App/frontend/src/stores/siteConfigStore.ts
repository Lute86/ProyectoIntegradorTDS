import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { siteConfigService } from '../services/siteConfigService';

export interface SiteConfig {
  siteName: string;
  siteSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  seoDescription: string;
  footerText: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
  layout: 'boxed' | 'full-width';
  themePreset: string;
  sections: { id: string; visible: boolean; order: number }[];
  socialLinks: {
    instagram: string;
    facebook: string;
  };
}

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'IFTS 29',
  siteSubtitle: 'Instituto de Formacion Tecnico Superior',
  contactEmail: 'contacto@ifts29.edu.ar',
  contactPhone: '+54 11 1234-5678',
  address: 'Av. Siempre Viva 123, CABA',
  seoDescription: 'Instituto de Formacion Tecnico Superior Nro 29',
  footerText: '2026 IFTS 29 - Todos los derechos reservados.',
  colors: {
    primary: '#2563eb',
    secondary: '#10b981',
    accent: '#f59e0b',
    surface: '#1e293b',
    background: '#ffffff',
    text: '#111827',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: '16px',
  },
  layout: 'full-width',
  themePreset: 'moderno',
  sections: [
    { id: 'hero', visible: true, order: 1 },
    { id: 'statistics', visible: true, order: 2 },
    { id: 'careers', visible: true, order: 3 },
    { id: 'news', visible: true, order: 4 },
    { id: 'events', visible: true, order: 5 },
    { id: 'testimonials', visible: true, order: 6 },
    { id: 'gallery', visible: true, order: 7 },
    { id: 'students', visible: true, order: 8 },
    { id: 'contact', visible: true, order: 9 },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/ifts29',
    facebook: 'https://facebook.com/ifts29',
  },
};

interface SiteConfigState {
  config: SiteConfig;
  isLoading: boolean;
  isDirty: boolean;
  fetchConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  updateConfig: (data: Partial<SiteConfig>) => void;
  updateColors: (colors: Partial<SiteConfig['colors']>) => void;
  updateTypography: (typography: Partial<SiteConfig['typography']>) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  resetConfig: () => void;
}

export const useSiteConfigStore = create<SiteConfigState>()(
  persist(
    (set) => ({
  config: DEFAULT_CONFIG,
  isLoading: false,
  isDirty: false,
  fetchConfig: async () => {
    set({ isLoading: true })
    try {
      const res = await siteConfigService.getConfig()
      const data = res.data?.data || res.data
      if (data) {
        set({
          config: {
            siteName: data.site_name || DEFAULT_CONFIG.siteName,
            siteSubtitle: data.site_subtitle || DEFAULT_CONFIG.siteSubtitle,
            contactEmail: data.contact_email || DEFAULT_CONFIG.contactEmail,
            contactPhone: data.contact_phone || DEFAULT_CONFIG.contactPhone,
            address: data.address || DEFAULT_CONFIG.address,
            seoDescription: data.seo_description || DEFAULT_CONFIG.seoDescription,
            footerText: data.footer_text || DEFAULT_CONFIG.footerText,
            colors: {
              primary: data.colors?.primary || DEFAULT_CONFIG.colors.primary,
              secondary: data.colors?.secondary || DEFAULT_CONFIG.colors.secondary,
              accent: data.colors?.accent || DEFAULT_CONFIG.colors.accent,
              surface: data.colors?.surface || DEFAULT_CONFIG.colors.surface,
              background: data.colors?.background || DEFAULT_CONFIG.colors.background,
              text: data.colors?.text || DEFAULT_CONFIG.colors.text,
            },
            typography: {
              headingFont: DEFAULT_CONFIG.typography.headingFont,
              bodyFont: DEFAULT_CONFIG.typography.bodyFont,
              baseSize: DEFAULT_CONFIG.typography.baseSize,
            },
            layout: 'full-width',
            //
            themePreset: data.theme_preset || DEFAULT_CONFIG.themePreset,
        //    sections: data.sections?.length
        //      ? data.sections.map((s) => ({
        //          id: s.id,
        //          visible: s.visible !== undefined ? s.visible : true,
        //          order: s.order !== undefined ? s.order : 0,
        //        }))
        //      : DEFAULT_CONFIG.sections,
            sections: data.sections?.length
              ? [
              ...data.sections.map((s) => ({
                id: s.id,
                visible: s.visible !== undefined ? s.visible : true,
                order: s.order !== undefined ? s.order : 0,
              })),
              ...DEFAULT_CONFIG.sections.filter(
                (d) => !data.sections.some((s) => s.id === d.id)
              ),
            ]
          : DEFAULT_CONFIG.sections, 
        // 
            socialLinks: data.social_links || DEFAULT_CONFIG.socialLinks,
          },
          isLoading: false,
        })
      }
    } catch {
      set({ isLoading: false })
    }
  },
  saveConfig: async () => {
    const state = useSiteConfigStore.getState();
    const cfg = state.config;
    const payload: Record<string, unknown> = {
      site_name: cfg.siteName || 'IFTS 29',
      site_subtitle: cfg.siteSubtitle || '',
      address: cfg.address || '',
      footer_text: cfg.footerText || '',
      colors: cfg.colors,
      layout: { mode: cfg.layout },
      sections: cfg.sections,
      typography: cfg.typography,
      theme_preset: cfg.themePreset || 'default',
      social_links: cfg.socialLinks,
    };
    if (cfg.contactEmail) payload.contact_email = cfg.contactEmail;
    if (cfg.contactPhone) payload.contact_phone = cfg.contactPhone;
    if (cfg.seoDescription) payload.seo_description = cfg.seoDescription;
    try {
      await api.put('/config', payload);
      set({ isDirty: false });
    } catch (err: any) {
      console.error('Error del backend:', err.response?.data);
      set({ isDirty: false });
      throw err;
    }
  },
  updateConfig: (data) => {
    set((state) => ({
      config: { ...state.config, ...data },
      isDirty: true,
    }));
  },
  updateColors: (colors) => {
    set((state) => ({
      config: {
        ...state.config,
        colors: { ...state.config.colors, ...colors },
      },
      isDirty: true,
    }));
  },
  updateTypography: (typography) => {
    set((state) => ({
      config: {
        ...state.config,
        typography: { ...state.config.typography, ...typography },
      },
      isDirty: true,
    }));
  },
  toggleSectionVisibility: (sectionId) => {
    set((state) => ({
      config: {
        ...state.config,
        sections: state.config.sections.map((s) =>
          s.id === sectionId ? { ...s, visible: !s.visible } : s
        ),
      },
      isDirty: true,
    }));
  },
  resetConfig: () => {
    set({ config: DEFAULT_CONFIG, isDirty: false });
  },
}),
{ name: 'site-config-storage' }
));
