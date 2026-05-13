/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback } from 'react';
import useUIStore from '../../stores/uiStore';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const toasts = useUIStore((s) => s.toasts);
  const addToast = useUIStore((s) => s.addToast);
  const removeToast = useUIStore((s) => s.removeToast);

  const showToast = useCallback((message, type = 'info') => {
    addToast({ message, type });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
