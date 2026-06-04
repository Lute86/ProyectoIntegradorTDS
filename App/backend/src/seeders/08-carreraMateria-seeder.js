export async function up(queryInterface, Sequelize) {
  const carreraSlug = 'desarrollo-de-software-a-distancia';
  const [carrera] = await queryInterface.sequelize.query(
    'SELECT id FROM carreras WHERE slug = ?',
    { replacements: [carreraSlug], type: Sequelize.QueryTypes.SELECT }
  );

  if (!carrera) {
    return;
  }

  const carreraId = carrera.id;

  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM carrera_materias WHERE carrera_id = ?',
    { replacements: [carreraId], type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const materias = await queryInterface.sequelize.query(
    'SELECT id FROM materias',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!materias || materias.length === 0) {
    return;
  }

  const now = new Date();
  const asignaciones = [];

  const cuatrimestreMap = {
    'Programacion I': 1, 'Matematica': 1, 'Ingles Tecnico I': 1, 'Introduccion a la Informatica': 1,
    'Programacion II': 2, 'Bases de Datos I': 2, 'Ingles Tecnico II': 2, 'Logica Computacional': 2,
    'Desarrollo Web': 3, 'Bases de Datos II': 3, 'Ingenieria de Software I': 3, 'Estadistica': 3,
    'Desarrollo Movil': 4, 'Ingenieria de Software II': 4, 'Practica Profesionalizante': 4, 'Etica Profesional': 4,
  };

  const cargaMap = {
    'Programacion I': 6, 'Matematica': 4, 'Ingles Tecnico I': 3, 'Introduccion a la Informatica': 3,
    'Programacion II': 6, 'Bases de Datos I': 4, 'Ingles Tecnico II': 3, 'Logica Computacional': 3,
    'Desarrollo Web': 6, 'Bases de Datos II': 4, 'Ingenieria de Software I': 4, 'Estadistica': 3,
    'Desarrollo Movil': 6, 'Ingenieria de Software II': 4, 'Practica Profesionalizante': 6, 'Etica Profesional': 2,
  };

  for (const materia of materias) {
    const [materiaData] = await queryInterface.sequelize.query(
      'SELECT nombre FROM materias WHERE id = ?',
      { replacements: [materia.id], type: Sequelize.QueryTypes.SELECT }
    );

    if (materiaData) {
      asignaciones.push({
        carrera_id: carreraId,
        materia_id: materia.id,
        cuatrimestre: cuatrimestreMap[materiaData.nombre] || 1,
        carga_horaria_semanal: cargaMap[materiaData.nombre] || 4,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  if (asignaciones.length > 0) {
    await queryInterface.bulkInsert('carrera_materias', asignaciones);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('carrera_materias', {}, {});
}
