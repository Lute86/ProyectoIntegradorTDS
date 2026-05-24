import { AuthProvider } from './contexts/AuthContext/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext/LayoutContext';
import { ToastProvider } from './contexts/ToastContext/ToastContext';
import AppRouter from './AppRouter';

/**
 * App Component - Punto de entrada principal.
 * Renderiza el router y envuelve la app en todos los contextos necesarios.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;