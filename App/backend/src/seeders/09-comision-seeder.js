export async function up(queryInterface, Sequelize) {
  const dialect = queryInterface.sequelize.getDialect();
  const q = (col) => dialect === 'postgres' ? `"${col}"` : col;

  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM comisiones',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const carreras = await queryInterface.sequelize.query(
    'SELECT id FROM carreras LIMIT 1',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!carreras || carreras.length === 0) {
    return;
  }

  const carreraId = carreras[0].id;

  const now = new Date();
  const anioActual = now.getFullYear();

  const semestre = 1;
  const activo = true;

  const comisionA = await queryInterface.sequelize.query(
    `INSERT INTO comisiones (carrera_id, nombre, anio_lectivo, semestre, activo, ${q('createdAt')}, ${q('updatedAt')})
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [carreraId, 'A', anioActual, 1, true, now, now],
      type: Sequelize.QueryTypes.INSERT,
    }
  );

  const comisionB = await queryInterface.sequelize.query(
    `INSERT INTO comisiones (carrera_id, nombre, anio_lectivo, semestre, activo, ${q('createdAt')}, ${q('updatedAt')})
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    {
      replacements: [carreraId, 'B', anioActual, 1, true, now, now],
      type: Sequelize.QueryTypes.INSERT,
    }
  );

  const comisionAId = Array.isArray(comisionA) ? comisionA[0] : comisionA;
  const comisionBId = Array.isArray(comisionB) ? comisionB[0] : comisionB;

  const asignaciones = await queryInterface.sequelize.query(
    'SELECT id FROM carrera_materias LIMIT 3',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (asignaciones && asignaciones.length > 0) {
    const junctionRows = [];

    if (asignaciones[0]) {
      junctionRows.push(
        { comision_id: comisionAId, carrera_materia_id: asignaciones[0].id, createdAt: now, updatedAt: now },
        { comision_id: comisionBId, carrera_materia_id: asignaciones[0].id, createdAt: now, updatedAt: now }
      );
    }
    if (asignaciones[1]) {
      junctionRows.push(
        { comision_id: comisionAId, carrera_materia_id: asignaciones[1].id, createdAt: now, updatedAt: now }
      );
    }
    if (asignaciones[2]) {
      junctionRows.push(
        { comision_id: comisionBId, carrera_materia_id: asignaciones[2].id, createdAt: now, updatedAt: now }
      );
    }

    if (junctionRows.length > 0) {
      await queryInterface.bulkInsert('comision_carrera_materias', junctionRows);
    }
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('comision_carrera_materias', {}, {});
  await queryInterface.bulkDelete('comisiones', {}, {});
}
