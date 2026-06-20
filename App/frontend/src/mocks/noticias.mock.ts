export interface CategoriaInfo {
  id: number;
  nombre: string;
  slug: string;
  color: string;
}

export interface AutorInfo {
  id: number;
  nombre: string;
  apellido: string;
  avatar_url?: string;
}

export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagen_destacada_url?: string;
  categoria_id?: number;
  categoria?: CategoriaInfo | null;
  autor_id: number;
  autor?: AutorInfo | null;
  estado: 'borrador' | 'publicado' | 'archivado';
  fecha_publicacion?: string;
}

export const NOTICIAS_MOCK: Noticia[] = [
  {
    id: 1,
    titulo: 'Inscripciones abiertas para el ciclo lectivo 2026',
    slug: 'inscripciones-abiertas-ciclo-lectivo-2026',
    contenido: '<p>Se encuentran abiertas las inscripciones para todas las carreras del <strong>IFTS 29</strong>.</p>',
    categoria_id: 1,
    categoria: { id: 1, nombre: 'Inscripciones', slug: 'inscripciones', color: '#3B82F6' },
    autor_id: 1,
    autor: { id: 1, nombre: 'Admin', apellido: 'IFTS 29' },
    estado: 'publicado',
    fecha_publicacion: '2026-05-10',
  },
  {
    id: 2,
    titulo: 'Jornada de Puertas Abiertas - Junio 2026',
    slug: 'jornada-puertas-abiertas-junio-2026',
    contenido: '<p>Te invitamos a conocer nuestras instalaciones y charlar con docentes y alumnos.</p>',
    categoria_id: 3,
    categoria: { id: 3, nombre: 'Eventos', slug: 'eventos', color: '#10B981' },
    autor_id: 1,
    autor: { id: 1, nombre: 'Admin', apellido: 'IFTS 29' },
    estado: 'publicado',
    fecha_publicacion: '2026-05-08',
  },
  {
    id: 3,
    titulo: 'Nuevo convenio de pasantias con empresas tech',
    slug: 'nuevo-convenio-pasantias-empresas-tech',
    contenido: '<p>El IFTS 29 firmo un convenio con importantes empresas del sector tecnologico.</p>',
    categoria_id: 1,
    categoria: { id: 1, nombre: 'Inscripciones', slug: 'inscripciones', color: '#3B82F6' },
    autor_id: 1,
    autor: { id: 1, nombre: 'Admin', apellido: 'IFTS 29' },
    estado: 'borrador',
    fecha_publicacion: '2026-05-05',
  },
  {
    id: 4,
    titulo: 'Taller de introduccion a la programacion',
    slug: 'taller-introduccion-programacion',
    contenido: '<p>Taller gratuito para estudiantes de secundaria interesados en programacion.</p>',
    categoria_id: 3,
    categoria: { id: 3, nombre: 'Eventos', slug: 'eventos', color: '#10B981' },
    autor_id: 1,
    autor: { id: 1, nombre: 'Admin', apellido: 'IFTS 29' },
    estado: 'borrador',
    fecha_publicacion: '2026-04-28',
  },
];
