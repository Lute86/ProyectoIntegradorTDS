import { AuthProvider } from './contexts/AuthContext/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext/ThemeContext';
import { LayoutProvider } from './contexts/LayoutContext/LayoutContext';
import { ToastProvider } from './contexts/ToastContext/ToastContext';
import AppRouter from './AppRouter';

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