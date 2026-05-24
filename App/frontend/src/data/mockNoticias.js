// Colores de etiqueta segun categoria
export const BADGE_COLORS = {
  Inscripciones: 'bg-blue-100 text-blue-700',
  Exámenes: 'bg-emerald-100 text-emerald-700',
  Evento: 'bg-amber-100 text-amber-700',
  Tecnología: 'bg-purple-100 text-purple-700',
  Becas: 'bg-rose-100 text-rose-700',
}

export const MOCK_NOTICIAS = [
  {
    id: 1, slug: 'inscripciones-abiertas-2026',
    titulo: 'Inscripciones Abiertas 2026',
    categoria: 'Inscripciones', autor: 'Admin', fecha: '15 Mar 2026',
    resumen: 'Se encuentran abiertas las inscripciones para el primer cuatrimestre 2026.',
    contenido: 'Se encuentran abiertas las inscripciones para el primer cuatrimestre 2026.\n\n## Requisitos\n\nLos interesados deben presentar:\n- DNI original y copia\n- Título secundario\n- Foto carnet 4x4\n\n## Proceso\n\n1. Completar formulario online\n2. Abonar el arancel\n3. Presentar la documentación\n\n## Fechas\n\nDel 1 de marzo al 30 de abril.',
  },
  {
    id: 2, slug: 'calendario-examenes-finales-abril-2026',
    titulo: 'Calendario de Exámenes Finales - Abril 2026',
    categoria: 'Exámenes', autor: 'Secretaría', fecha: '10 Mar 2026',
    resumen: 'Calendario completo de exámenes finales para el turno Abril.',
    contenido: 'Calendario de exámenes finales.\n\n## Desarrollo de Software\n- 14/04 - Programación I\n- 15/04 - Base de Datos\n\n## Seguridad Informática\n- 14/04 - Redes\n- 15/04 - Criptografía\n\n## Análisis de Datos\n- 16/04 - Estadística\n- 17/04 - Machine Learning\n\nInscripción hasta el 25 de marzo.',
  },
  {
    id: 3, slug: 'jornada-puertas-abiertas',
    titulo: 'Jornada de Puertas Abiertas',
    categoria: 'Evento', autor: 'Comunicación', fecha: '5 Mar 2026',
    resumen: 'Te invitamos a conocer nuestras instalaciones y hablar con docentes y alumnos.',
    contenido: 'Jornada de Puertas Abiertas.\n\n## Cuándo\nSábado 22 de marzo, 10 a 16 hs.\n\n## Actividades\n- 10:30 Charla informativa\n- 11:30 Recorrido\n- 12:30 Charla con egresados\n- 13:30 Talleres demo\n\nEntrada libre y gratuita.',
  },
  {
    id: 4, slug: 'workshop-introduccion-ia',
    titulo: 'Workshop: Introducción a la IA',
    categoria: 'Tecnología', autor: 'Docentes', fecha: '1 Mar 2026',
    resumen: 'Workshop gratuito sobre Inteligencia Artificial. Cupos limitados.',
    contenido: 'Workshop de IA.\n\n## Temas\n1. Fundamentos de IA\n2. Machine Learning\n3. Redes Neuronales\n4. IA Generativa\n5. Ética en IA\n\n## Requisitos\n- Programación básica\n- Traer laptop\n\nViernes 28 de marzo, 18 hs.',
  },
  {
    id: 5, slug: 'nuevo-laboratorio-computacion',
    titulo: 'Nuevo laboratorio de computación',
    categoria: 'Tecnología', autor: 'Admin', fecha: '20 Feb 2026',
    resumen: 'Inauguramos un laboratorio con tecnología de última generación.',
    contenido: 'Nuevo laboratorio.\n\n## Equipamiento\n- 30 PCs última generación\n- Monitores 4K\n- Fibra óptica\n- Software especializado\n\nLunes a viernes 8 a 22 hs.',
  },
  {
    id: 6, slug: 'convenio-empresas-tecnologia',
    titulo: 'Convenio con empresas de tecnología',
    categoria: 'Inscripciones', autor: 'Admin', fecha: '15 Feb 2026',
    resumen: 'Nuevos convenios para potenciar oportunidades laborales de estudiantes.',
    contenido: 'Convenios firmados con TechCorp, DataSys, NetSecure y WebCraft.\n\n## Beneficios\n- Pasantías rentadas\n- Mentoría profesional\n- Bolsa de trabajo exclusiva',
  },
  {
    id: 7, slug: 'becas-disponibles-2026',
    titulo: 'Becas disponibles 2026',
    categoria: 'Becas', autor: 'Admin', fecha: '10 Feb 2026',
    resumen: 'Conocé las becas disponibles para el ciclo lectivo 2026.',
    contenido: 'Becas 2026.\n\n## Tipos\n- Excelencia: 100% arancel\n- Apoyo: 50-75%\n- Deportiva: 50%\n\nFecha límite: 31 de marzo.',
  },
]
