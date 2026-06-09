export async function up(queryInterface, Sequelize) {
  const [categorias] = await queryInterface.sequelize.query(
    'SELECT id, slug FROM categorias',
  );

  const [admin] = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE email = 'admin@ifts29.edu.ar' LIMIT 1",
  );

  const autorId = admin.length > 0 ? admin[0].id : 1;

  const getCategoriaId = (slug) => {
    const cat = categorias.find((c) => c.slug === slug);
    return cat ? cat.id : null;
  };

  const fecha = (diasAtras) => {
    const date = new Date();
    date.setDate(date.getDate() - diasAtras);
    return date;
  };

  const noticias = [
    {
      titulo: 'Inscripciones abiertas para el ciclo lectivo',
      slug: 'inscripciones-abiertas-ciclo-lectivo',
      contenido: 'Se encuentran abiertas las inscripciones para todas las carreras del IFTS 29. Acercate a nuestra sede de lunes a viernes de 9 a 18 hs o realiza el tramite de forma virtual a traves de nuestra plataforma.',
      imagen_destacada_url: null,
      categoria_id: getCategoriaId('inscripciones'),
      autor_id: autorId,
      estado: 'publicado',
      fecha_publicacion: fecha(2),
    },
    {
      titulo: 'Calendario de examenes finales',
      slug: 'calendario-examenes-finales',
      contenido: 'Ya se encuentra disponible el calendario de examenes finales correspondiente al cuatrimestre en curso. Los estudiantes pueden consultar las fechas y horarios en el sistema academico.',
      imagen_destacada_url: null,
      categoria_id: getCategoriaId('examenes'),
      autor_id: autorId,
      estado: 'publicado',
      fecha_publicacion: fecha(5),
    },
    {
      titulo: 'Taller de introduccion a la programacion',
      slug: 'taller-introduccion-programacion',
      contenido: 'El IFTS 29 organiza un taller gratuito de introduccion a la programacion para todo publico. No se requieren conocimientos previos. Cupos limitados.',
      imagen_destacada_url: null,
      categoria_id: getCategoriaId('eventos'),
      autor_id: autorId,
      estado: 'publicado',
      fecha_publicacion: fecha(10),
    },
    {
      titulo: 'Nuevas becas disponibles para estudiantes',
      slug: 'nuevas-becas-disponibles',
      contenido: 'Se han abierto las convocatorias para las becas Progresar y Becas Manuel Belgrano. Los interesados pueden postularse hasta el 30 del corriente.',
      imagen_destacada_url: null,
      categoria_id: getCategoriaId('becas'),
      autor_id: autorId,
      estado: 'publicado',
      fecha_publicacion: fecha(15),
    },
    {
      titulo: 'Actualizacion del plan de estudios',
      slug: 'actualizacion-plan-estudios',
      contenido: 'El departamento academico informa la actualizacion del plan de estudios de la carrera Desarrollo de Software, incorporando nuevas materias orientadas a inteligencia artificial.',
      imagen_destacada_url: null,
      categoria_id: getCategoriaId('tecnologia'),
      autor_id: autorId,
      estado: 'borrador',
      fecha_publicacion: null,
    },
  ];

  for (const noticia of noticias) {
    const [existing] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM noticias WHERE slug = ?',
      { replacements: [noticia.slug], type: Sequelize.QueryTypes.SELECT },
    );

    if (Number(existing.count) === 0) {
      await queryInterface.bulkInsert('noticias', [
        {
          ...noticia,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('noticias', {
    slug: [
      'inscripciones-abiertas-ciclo-lectivo',
      'calendario-examenes-finales',
      'taller-introduccion-programacion',
      'nuevas-becas-disponibles',
      'actualizacion-plan-estudios',
    ],
  }, {});
}
