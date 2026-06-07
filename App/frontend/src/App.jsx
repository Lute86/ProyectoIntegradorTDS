import { useEffect, useRef } from 'react';
import { AuthProvider } from './contexts/AuthContext/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext/LayoutContext';
import { ToastProvider } from './contexts/ToastContext/ToastContext';
import { useSiteConfigStore } from './stores/siteConfigStore';
import AppRouter from './AppRouter';

function inyectarVariables(config) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.colors.primary);
  root.style.setProperty('--color-secondary', config.colors.secondary);
  root.style.setProperty('--color-accent', config.colors.accent);
  root.style.setProperty('--color-bg', config.colors.background);
  root.style.setProperty('--color-text', config.colors.text);
  root.style.setProperty('--font-heading', `"${config.typography.headingFont}", sans-serif`);
  root.style.setProperty('--font-body', `"${config.typography.bodyFont}", sans-serif`);
}

function ThemeInitializer({ children }) {
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

  // Solo trae datos de la API si es la primera visita (no hay nada persistido aun)
  useEffect(() => {
    const persistido = localStorage.getItem('site-config-storage');
    if (!persistido) {
      fetchConfig();
    }
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
