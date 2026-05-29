export async function up(queryInterface, Sequelize) {
  const eventos = [
    {
      nombre: 'Charla: Inteligencia Artificial en la Educacion',
      descripcion: 'Charla abierta sobre el impacto de la inteligencia artificial en los procesos educativos actuales. Disertante invitado: Ing. Martin Rodriguez.',
      fecha: '2026-07-15',
      ubicacion: 'Auditorio IFTS 29',
      estado: 'confirmado',
    },
    {
      nombre: 'Taller de Programacion Web Avanzada',
      descripcion: 'Taller intensivo de 3 dias sobre desarrollo web full-stack con tecnologias modernas. Cupos limitados.',
      fecha: '2026-08-10',
      ubicacion: 'Laboratorio de Informatica',
      estado: 'confirmado',
    },
    {
      nombre: 'Jornada de Puertas Abiertas',
      descripcion: 'Jornada informativa para futuros estudiantes. Se presentaran todas las carreras y se realizaran visitas guiadas por las instalaciones.',
      fecha: '2026-09-05',
      ubicacion: 'Sede IFTS 29',
      estado: 'pendiente',
    },
    {
      nombre: 'Seminario: Etica y Tecnologia',
      descripcion: 'Seminario interdisciplinario sobre los desafios eticos en el desarrollo tecnologico contemporaneo.',
      fecha: '2026-10-20',
      ubicacion: 'Aula Magna',
      estado: 'pendiente',
    },
    {
      nombre: 'Hackathon IFTS 29',
      descripcion: 'Competencia de programacion por equipos. 48 horas para desarrollar soluciones innovadoras a problematicas sociales.',
      fecha: '2026-11-12',
      ubicacion: 'Sede Central',
      estado: 'pendiente',
    },
  ];

  for (const evento of eventos) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM eventos WHERE nombre = ?',
      { replacements: [evento.nombre], type: Sequelize.QueryTypes.SELECT },
    );

    if (existing.count === 0) {
      await queryInterface.bulkInsert('eventos', [
        {
          ...evento,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('eventos', {
    nombre: [
      'Charla: Inteligencia Artificial en la Educacion',
      'Taller de Programacion Web Avanzada',
      'Jornada de Puertas Abiertas',
      'Seminario: Etica y Tecnologia',
      'Hackathon IFTS 29',
    ],
  }, {});
}
