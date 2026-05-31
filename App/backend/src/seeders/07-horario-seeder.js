export async function up(queryInterface, Sequelize) {
  const materias = await queryInterface.sequelize.query(
    'SELECT id FROM materias LIMIT 3',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!materias || materias.length === 0) {
    return;
  }

  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM horarios',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const now = new Date();
  const horarios = [];

  if (materias[0]) {
    horarios.push(
      { materia_id: materias[0].id, comision: 'A', dia: 'Lunes', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez', activo: true, createdAt: now, updatedAt: now },
      { materia_id: materias[0].id, comision: 'A', dia: 'Miercoles', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez', activo: true, createdAt: now, updatedAt: now },
      { materia_id: materias[0].id, comision: 'B', dia: 'Martes', horario: '20:00 - 22:00', aula: 'Aula 7', profesor: 'Prof. Garcia', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (materias[1]) {
    horarios.push(
      { materia_id: materias[1].id, comision: 'Todas', dia: 'Lunes', horario: '20:00 - 22:00', aula: 'Aula 5', profesor: 'Prof. Rodriguez', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (materias[2]) {
    horarios.push(
      { materia_id: materias[2].id, comision: 'Todas', dia: 'Viernes', horario: '18:00 - 20:00', aula: 'Aula 3', profesor: 'Prof. Smith', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (horarios.length > 0) {
    await queryInterface.bulkInsert('horarios', horarios);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('horarios', {}, {});
}
