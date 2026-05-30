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
    'SELECT COUNT(*) as count FROM materias WHERE carrera_id = ?',
    { replacements: [carreraId], type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const now = new Date();

  const materias = [
    // Primer Cuatrimestre
    { nombre: 'Programacion I', cuatrimestre: 1, carga_horaria_semanal: 6, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Matematica', cuatrimestre: 1, carga_horaria_semanal: 4, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Ingles Tecnico I', cuatrimestre: 1, carga_horaria_semanal: 3, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Introduccion a la Informatica', cuatrimestre: 1, carga_horaria_semanal: 3, carrera_id: carreraId, createdAt: now, updatedAt: now },

    // Segundo Cuatrimestre
    { nombre: 'Programacion II', cuatrimestre: 2, carga_horaria_semanal: 6, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Bases de Datos I', cuatrimestre: 2, carga_horaria_semanal: 4, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Ingles Tecnico II', cuatrimestre: 2, carga_horaria_semanal: 3, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Logica Computacional', cuatrimestre: 2, carga_horaria_semanal: 3, carrera_id: carreraId, createdAt: now, updatedAt: now },

    // Tercer Cuatrimestre
    { nombre: 'Desarrollo Web', cuatrimestre: 3, carga_horaria_semanal: 6, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Bases de Datos II', cuatrimestre: 3, carga_horaria_semanal: 4, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Ingenieria de Software I', cuatrimestre: 3, carga_horaria_semanal: 4, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Estadistica', cuatrimestre: 3, carga_horaria_semanal: 3, carrera_id: carreraId, createdAt: now, updatedAt: now },

    // Cuarto Cuatrimestre
    { nombre: 'Desarrollo Movil', cuatrimestre: 4, carga_horaria_semanal: 6, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Ingenieria de Software II', cuatrimestre: 4, carga_horaria_semanal: 4, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Practica Profesionalizante', cuatrimestre: 4, carga_horaria_semanal: 6, carrera_id: carreraId, createdAt: now, updatedAt: now },
    { nombre: 'Etica Profesional', cuatrimestre: 4, carga_horaria_semanal: 2, carrera_id: carreraId, createdAt: now, updatedAt: now },
  ];

  await queryInterface.bulkInsert('materias', materias);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('materias', {}, {});
}
