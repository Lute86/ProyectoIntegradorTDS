export interface GaleriaImagen {
  id: number;
  titulo: string;
  categoria: 'Instalaciones' | 'Eventos' | 'Alumnos';
  url: string;
}

export const GALERIA_MOCK: GaleriaImagen[] = [
  {
    id: 1,
    titulo: 'Fachada del edificio',
    categoria: 'Instalaciones',
    url: 'https://picsum.photos/seed/ifts29-1/400/300',
  },
  {
    id: 2,
    titulo: 'Aula de informatica',
    categoria: 'Instalaciones',
    url: 'https://picsum.photos/seed/ifts29-2/400/300',
  },
  {
    id: 3,
    titulo: 'Jornada de programacion',
    categoria: 'Eventos',
    url: 'https://picsum.photos/seed/ifts29-3/400/300',
  },
  {
    id: 4,
    titulo: 'Graduacion 2025',
    categoria: 'Eventos',
    url: 'https://picsum.photos/seed/ifts29-4/400/300',
  },
  {
    id: 5,
    titulo: 'Grupo de estudio',
    categoria: 'Alumnos',
    url: 'https://picsum.photos/seed/ifts29-5/400/300',
  },
  {
    id: 6,
    titulo: 'Taller de robotica',
    categoria: 'Alumnos',
    url: 'https://picsum.photos/seed/ifts29-6/400/300',
  },
];
