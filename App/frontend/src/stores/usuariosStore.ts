import { create } from 'zustand';
import api from '../services/api';
import { User } from '../mocks/users.mock';

interface UsuariosState {
  usuarios: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<void>;
  addUsuario: (usuario: Omit<User, 'id' | 'ultimo_acceso'>) => Promise<void>;
  updateUsuario: (id: number, data: Partial<User>) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
}

export const useUsuariosStore = create<UsuariosState>((set) => ({
  usuarios: [],
  isLoading: false,
  error: null,
  fetchUsuarios: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/usuarios');
      set({ usuarios: response.data.data, isLoading: false });
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al cargar los usuarios';
      set({ error: mensaje, isLoading: false });
    }
  },
  addUsuario: async (nuevoUsuario) => {
    try {
      const response = await api.post('/usuarios', nuevoUsuario);
      set((state) => ({
        usuarios: [...state.usuarios, response.data.data],
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al crear el usuario';
      set({ error: mensaje });
    }
  },
  updateUsuario: async (id, data) => {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      set((state) => ({
        usuarios: state.usuarios.map((u) =>
          u.id === id ? { ...u, ...response.data.data } : u
        ),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el usuario';
      set({ error: mensaje });
    }
  },
  deleteUsuario: async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      set((state) => ({
        usuarios: state.usuarios.filter((u) => u.id !== id),
      }));
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al eliminar el usuario';
      set({ error: mensaje });
    }
  },
}));
