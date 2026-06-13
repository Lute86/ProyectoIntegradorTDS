export async function up(queryInterface, Sequelize) {
  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM comisiones',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const asignaciones = await queryInterface.sequelize.query(
    'SELECT id FROM carrera_materias LIMIT 3',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!asignaciones || asignaciones.length === 0) {
    return;
  }

  const now = new Date();
  const anioActual = now.getFullYear();
  const comisiones = [];

  if (asignaciones[0]) {
    comisiones.push(
      { carrera_materia_id: asignaciones[0].id, nombre: 'A', anio_lectivo: anioActual, semestre: 1, activo: true, createdAt: now, updatedAt: now },
      { carrera_materia_id: asignaciones[0].id, nombre: 'B', anio_lectivo: anioActual, semestre: 1, activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (asignaciones[1]) {
    comisiones.push(
      { carrera_materia_id: asignaciones[1].id, nombre: 'Todas', anio_lectivo: anioActual, semestre: 1, activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (asignaciones[2]) {
    comisiones.push(
      { carrera_materia_id: asignaciones[2].id, nombre: '1', anio_lectivo: anioActual, semestre: 2, activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (comisiones.length > 0) {
    await queryInterface.bulkInsert('comisiones', comisiones);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('comisiones', {}, {});
}
