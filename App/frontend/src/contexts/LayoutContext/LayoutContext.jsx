/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import useUIStore from '../../stores/uiStore';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
