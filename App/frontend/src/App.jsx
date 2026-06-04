import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext/LayoutContext';
import { ToastProvider } from './contexts/ToastContext/ToastContext';
import { useSiteConfigStore } from './stores/siteConfigStore';
import AppRouter from './AppRouter';

function ThemeInitializer({ children }) {
  const { config, fetchConfig } = useSiteConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-secondary', config.colors.secondary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-bg', config.colors.background);
    root.style.setProperty('--color-text', config.colors.text);
    root.style.setProperty('--font-heading', `"${config.typography.headingFont}", sans-serif`);
    root.style.setProperty('--font-body', `"${config.typography.bodyFont}", sans-serif`);
  }, [config]);

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