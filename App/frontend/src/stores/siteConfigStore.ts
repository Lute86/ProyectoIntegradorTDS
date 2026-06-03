import { create } from 'zustand';
import api from '../services/api';

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
  sections: { id: string; visible: boolean }[];
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
    { id: 'hero', visible: true },
    { id: 'carreras', visible: true },
    { id: 'noticias', visible: true },
    { id: 'testimonios', visible: true },
    { id: 'contacto', visible: true },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/ifts29',
    facebook: 'https://facebook.com/ifts29',
  },
};

interface SiteConfigState {
  config: SiteConfig;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  fetchConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  updateConfig: (data: Partial<SiteConfig>) => void;
  updateColors: (colors: Partial<SiteConfig['colors']>) => void;
  updateTypography: (typography: Partial<SiteConfig['typography']>) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  resetConfig: () => void;
}

export const useSiteConfigStore = create<SiteConfigState>((set, get) => ({
  config: DEFAULT_CONFIG,
  isLoading: false,
  error: null,
  isDirty: false,
  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/config');
      set({ config: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar la configuracion';
      set({ error: mensaje, isLoading: false });
    }
  },
  saveConfig: async () => {
    try {
      const { config } = get();
      await api.put('/config', config);
      set({ isDirty: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al guardar la configuracion';
      set({ error: mensaje });
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
}));
