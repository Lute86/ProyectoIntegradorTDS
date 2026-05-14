import { create } from 'zustand';
import { User, USERS_MOCK } from '../mocks/users.mock';

interface UsuariosState {
  usuarios: User[];
  isLoading: boolean;
  error: string | null;
  // Acciones
  fetchUsuarios: () => Promise<void>;
  addUsuario: (usuario: Omit<User, 'id' | 'ultimo_acceso'>) => void;
  updateUsuario: (id: number, data: Partial<User>) => void;
  deleteUsuario: (id: number) => void;
}

/**
 * usuariosStore - Módulo 4: Gestión de Usuarios
 * Implementación Simple & Type-Safe con Zustand.
 */
export const useUsuariosStore = create<UsuariosState>((set) => ({
  usuarios: [],
  isLoading: false,
  error: null,
  fetchUsuarios: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ usuarios: USERS_MOCK, isLoading: false });
    } catch (err) {
      set({ error: 'Error al cargar los usuarios', isLoading: false });
    }
  },
  addUsuario: (nuevoUsuario) => {
    set((state) => ({
      usuarios: [
        ...state.usuarios,
        {
          ...nuevoUsuario,
          id: Math.max(...state.usuarios.map((u) => u.id), 0) + 1,
          ultimo_acceso: new Date().toISOString(),
        },
      ],
    }));
  },
  updateUsuario: (id, data) => {
    set((state) => ({
      usuarios: state.usuarios.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
  },
  deleteUsuario: (id) => {
    set((state) => ({
      usuarios: state.usuarios.filter((u) => u.id !== id),
    }));
  },
}));
