import { describe, it, expect, beforeEach } from 'vitest';
import useUIStore from '../../stores/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({ theme: 'light', sidebarOpen: false, toasts: [] });
  });

  // Verifica que el theme inicial es light
  it('inicia con theme light', () => {
    expect(useUIStore.getState().theme).toBe('light');
  });

  // Verifica que toggleTheme cambia de light a dark y persiste en localStorage
  it('toggleTheme cambia de light a dark', () => {
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  // Verifica que toggleTheme cambia de dark a light
  it('toggleTheme cambia de dark a light', () => {
    useUIStore.setState({ theme: 'dark' });
    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
  });

  // Verifica que setTheme guarda el valor en localStorage
  it('setTheme persiste en localStorage', () => {
    useUIStore.getState().setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  // Verifica que toggleSidebar alterna el estado de sidebarOpen
  it('toggleSidebar cambia sidebarOpen', () => {
    expect(useUIStore.getState().sidebarOpen).toBe(false);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  // Verifica que addToast agrega un toast con id y mensaje
  it('addToast agrega un toast', () => {
    useUIStore.getState().addToast({ message: 'Hola', type: 'info' });
    const toasts = useUIStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe('Hola');
    expect(toasts[0].id).toBeDefined();
  });

  // Verifica que removeToast elimina el toast correspondiente al id
  it('removeToast elimina un toast por id', () => {
    useUIStore.getState().addToast({ message: 'Uno' });
    useUIStore.getState().addToast({ message: 'Dos' });
    const id = useUIStore.getState().toasts[0].id;
    useUIStore.getState().removeToast(id);
    expect(useUIStore.getState().toasts).toHaveLength(1);
    expect(useUIStore.getState().toasts[0].message).toBe('Dos');
  });
});
