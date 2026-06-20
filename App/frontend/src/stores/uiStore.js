import { create } from 'zustand';

let toastId = 0;

const useUIStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  toasts: [],

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return { theme: next };
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { id: ++toastId, ...toast }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  pageNotification: null,

  setPageNotification: (notification) =>
    set({ pageNotification: notification }),

  clearPageNotification: () =>
    set({ pageNotification: null }),
}));

export default useUIStore;
