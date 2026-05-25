export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'profesor' | 'tutor';
  avatar_url?: string;
  activo: boolean;
  ultimo_acceso: string;
}

export const USERS_MOCK: User[] = [
  {
    id: 1,
    nombre: 'Andrés',
    apellido: 'García',
    email: 'admin@ifts29.edu.ar',
    rol: 'admin',
    avatar_url: 'https://ui-avatars.com/api/?name=Andres+Garcia&background=2563eb&color=fff',
    activo: true,
    ultimo_acceso: '2026-05-13T14:30:00Z',
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'López',
    email: 'm.lopez@ifts29.edu.ar',
    rol: 'profesor',
    avatar_url: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=10b981&color=fff',
    activo: true,
    ultimo_acceso: '2026-05-13T10:15:00Z',
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Martínez',
    email: 'c.martinez@ifts29.edu.ar',
    rol: 'tutor',
    avatar_url: 'https://ui-avatars.com/api/?name=Carlos+Martinez&background=f59e0b&color=fff',
    activo: true,
    ultimo_acceso: '2026-05-12T18:45:00Z',
  },
  {
    id: 4,
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'l.fernandez@ifts29.edu.ar',
    rol: 'profesor',
    avatar_url: 'https://ui-avatars.com/api/?name=Lucia+Fernandez&background=10b981&color=fff',
    activo: false,
    ultimo_acceso: '2026-02-15T09:00:00Z',
  },
  {
    id: 5,
    nombre: 'Roberto',
    apellido: 'Sánchez',
    email: 'r.sanchez@ifts29.edu.ar',
    rol: 'tutor',
    avatar_url: 'https://ui-avatars.com/api/?name=Roberto+Sanchez&background=f59e0b&color=fff',
    activo: true,
    ultimo_acceso: '2026-05-11T12:00:00Z',
  },
];
