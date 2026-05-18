import { create } from 'zustand';

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
  sections: string[];
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
  sections: ['hero', 'carreras', 'noticias', 'testimonios', 'contacto'],
};

interface SiteConfigState {
  config: SiteConfig;
  isDirty: boolean;
  updateConfig: (data: Partial<SiteConfig>) => void;
  updateColors: (colors: Partial<SiteConfig['colors']>) => void;
  updateTypography: (typography: Partial<SiteConfig['typography']>) => void;
  resetConfig: () => void;
}

export const useSiteConfigStore = create<SiteConfigState>((set) => ({
  config: DEFAULT_CONFIG,
  isDirty: false,
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
  resetConfig: () => {
    set({ config: DEFAULT_CONFIG, isDirty: false });
  },
}));
