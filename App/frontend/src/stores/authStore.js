import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,

  checkAuth: () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedUser) {
      set({ user: JSON.parse(savedUser), token: savedToken, loading: false });
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
