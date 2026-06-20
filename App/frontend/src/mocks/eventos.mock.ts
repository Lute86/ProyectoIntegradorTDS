export interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  hora: string;
  modalidad: 'presencial' | 'virtual';
  estado: 'borrador' | 'publicado';
  descripcion: string;
}

export const EVENTOS_MOCK: Evento[] = [
  {
    id: 1,
    titulo: 'Jornada de Puertas Abiertas',
    fecha: '2026-06-15',
    hora: '10:00',
    modalidad: 'presencial',
    estado: 'publicado',
    descripcion: '<p>Te invitamos a conocer nuestras instalaciones y todas las carreras que ofrece el <strong>IFTS 29</strong>.</p>',
  },
  {
    id: 2,
    titulo: 'Charla: Inteligencia Artificial en la Educacion',
    fecha: '2026-06-22',
    hora: '18:30',
    modalidad: 'virtual',
    estado: 'publicado',
    descripcion: '<p>Webinar gratuito sobre el impacto de la IA en la educacion superior.</p>',
  },
  {
    id: 3,
    titulo: 'Taller de Programacion Web',
    fecha: '2026-07-05',
    hora: '14:00',
    modalidad: 'presencial',
    estado: 'borrador',
    descripcion: '<p>Taller intensivo de 3 dias sobre desarrollo web full-stack.</p>',
  },
  {
    id: 4,
    titulo: 'Seminario de Innovacion Tecnologica',
    fecha: '2026-07-20',
    hora: '09:00',
    modalidad: 'virtual',
    estado: 'borrador',
    descripcion: '<p>Seminario internacional con expositores de Latinoamerica.</p>',
  },
];
