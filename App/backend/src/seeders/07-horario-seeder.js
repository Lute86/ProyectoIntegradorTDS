export async function up(queryInterface, Sequelize) {
  const asignaciones = await queryInterface.sequelize.query(
    'SELECT id FROM carrera_materias LIMIT 3',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!asignaciones || asignaciones.length === 0) {
    return;
  }

  const [existingCount] = await queryInterface.sequelize.query(
    'SELECT COUNT(*) as count FROM horarios',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (existingCount.count > 0) {
    return;
  }

  const comisiones = await queryInterface.sequelize.query(
    'SELECT id, nombre FROM comisiones',
    { type: Sequelize.QueryTypes.SELECT }
  );

  if (!comisiones || comisiones.length === 0) {
    return;
  }

  const comisionMap = {};
  for (const c of comisiones) {
    comisionMap[c.nombre] = c.id;
  }

  const now = new Date();
  const horarios = [];

  if (asignaciones[0] && comisionMap['A']) {
    horarios.push(
      { carrera_materia_id: asignaciones[0].id, comision_id: comisionMap['A'], dia: 'Lunes', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez', activo: true, createdAt: now, updatedAt: now },
      { carrera_materia_id: asignaciones[0].id, comision_id: comisionMap['A'], dia: 'Miercoles', horario: '18:00 - 20:00', aula: 'Aula 5', profesor: 'Prof. Martinez', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (asignaciones[0] && comisionMap['B']) {
    horarios.push(
      { carrera_materia_id: asignaciones[0].id, comision_id: comisionMap['B'], dia: 'Martes', horario: '20:00 - 22:00', aula: 'Aula 7', profesor: 'Prof. Garcia', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (asignaciones[1] && comisionMap['A']) {
    horarios.push(
      { carrera_materia_id: asignaciones[1].id, comision_id: comisionMap['A'], dia: 'Lunes', horario: '20:00 - 22:00', aula: 'Aula 5', profesor: 'Prof. Rodriguez', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (asignaciones[2] && comisionMap['B']) {
    horarios.push(
      { carrera_materia_id: asignaciones[2].id, comision_id: comisionMap['B'], dia: 'Viernes', horario: '18:00 - 20:00', aula: 'Aula 3', profesor: 'Prof. Smith', activo: true, createdAt: now, updatedAt: now }
    );
  }

  if (horarios.length > 0) {
    await queryInterface.bulkInsert('horarios', horarios);
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('horarios', {}, {});
}
