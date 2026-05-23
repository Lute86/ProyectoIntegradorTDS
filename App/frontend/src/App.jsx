import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext/AuthContext';
import useUIStore from './stores/uiStore';
import AppRouter from './AppRouter';

function App() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setTheme]);

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;