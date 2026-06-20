import { useEffect, useRef } from 'react';
import { AuthProvider } from './contexts/AuthContext/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext/LayoutContext';
import { ToastProvider } from './contexts/ToastContext/ToastContext';
import { useSiteConfigStore } from './stores/siteConfigStore';
import useGoogleFonts from './hooks/useGoogleFonts';
import AppRouter from './AppRouter';

function inyectarVariables(config) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.colors.primary);
  root.style.setProperty('--color-secondary', config.colors.secondary);
  root.style.setProperty('--color-accent', config.colors.accent);
  root.style.setProperty('--color-surface', config.colors.surface);
  root.style.setProperty('--color-bg', config.colors.background);
  root.style.setProperty('--color-text', config.colors.text);
  root.style.setProperty('--clr-primary', config.colors.primary);
  root.style.setProperty('--clr-secondary', config.colors.secondary);
  root.style.setProperty('--clr-accent', config.colors.accent);
  root.style.setProperty('--clr-surface', config.colors.surface);
  root.style.setProperty('--clr-bg', config.colors.background);
  root.style.setProperty('--clr-card', config.colors.card || '#ffffff');
  root.style.setProperty('--clr-text', config.colors.text);
  root.style.setProperty('--font-heading', `"${config.typography.headingFont}", sans-serif`);
  root.style.setProperty('--font-body', `"${config.typography.bodyFont}", sans-serif`);
  root.style.setProperty('--font-base-size', config.typography.baseSize);
}

function ThemeInitializer({ children }) {
  useGoogleFonts();
  const config = useSiteConfigStore((s) => s.config);
  const fetchConfig = useSiteConfigStore((s) => s.fetchConfig);
  const primeraVez = useRef(true);

  // Inyecta las variables ni bien se monta el componente (hidrata desde persist o default)
  useEffect(() => {
    if (primeraVez.current) {
      inyectarVariables(config);
      primeraVez.current = false;
    }
  }, [config]);

  // Escucha cambios y re-inyecta
  useEffect(() => {
    inyectarVariables(config);
  }, [config]);

  // Siempre trae datos de la API para mantener el sitio actualizado
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <ToastProvider>
            <ThemeInitializer>
              <AppRouter />
            </ThemeInitializer>
          </ToastProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
