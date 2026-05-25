export interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  contenido: string;
  estado: 'borrador' | 'publicado';
  fecha_publicacion: string;
}

export const NOTICIAS_MOCK: Noticia[] = [
  {
    id: 1,
    titulo: 'Inscripciones abiertas para el ciclo lectivo 2026',
    categoria: 'Institucional',
    contenido: '<p>Se encuentran abiertas las inscripciones para todas las carreras del <strong>IFTS 29</strong>.</p>',
    estado: 'publicado',
    fecha_publicacion: '2026-05-10',
  },
  {
    id: 2,
    titulo: 'Jornada de Puertas Abiertas - Junio 2026',
    categoria: 'Eventos',
    contenido: '<p>Te invitamos a conocer nuestras instalaciones y charlar con docentes y alumnos.</p>',
    estado: 'publicado',
    fecha_publicacion: '2026-05-08',
  },
  {
    id: 3,
    titulo: 'Nuevo convenio de pasantias con empresas tech',
    categoria: 'Institucional',
    contenido: '<p>El IFTS 29 firmo un convenio con importantes empresas del sector tecnologico.</p>',
    estado: 'borrador',
    fecha_publicacion: '2026-05-05',
  },
  {
    id: 4,
    titulo: 'Taller de introduccion a la programacion',
    categoria: 'Cursos',
    contenido: '<p>Taller gratuito para estudiantes de secundaria interesados en programacion.</p>',
    estado: 'borrador',
    fecha_publicacion: '2026-04-28',
  },
];
