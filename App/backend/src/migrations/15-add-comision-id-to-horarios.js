export async function up(queryInterface, Sequelize) {
  const tableInfo = await queryInterface.describeTable('horarios');
  
  if (tableInfo.comision_id) {
    return;
  }

  const dialect = queryInterface.sequelize.getDialect();
  const q = (col) => dialect === 'postgres' ? `"${col}"` : col;

  await queryInterface.addColumn('horarios', 'comision_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'comisiones', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  });

  const horarios = await queryInterface.sequelize.query(
    'SELECT id, carrera_materia_id, comision FROM horarios WHERE comision IS NOT NULL',
    { type: Sequelize.QueryTypes.SELECT }
  );

  const comisionMap = {};
  const now = new Date();

  for (const horario of horarios) {
    const key = `${horario.carrera_materia_id}-${horario.comision}`;
    
    if (!comisionMap[key]) {
      const anioActual = now.getFullYear();
      const activoVal = dialect === 'postgres' ? true : 1;
      const [comisionResult] = await queryInterface.sequelize.query(
        `INSERT INTO comisiones (carrera_materia_id, nombre, anio_lectivo, semestre, activo, ${q('createdAt')}, ${q('updatedAt')})
         VALUES (?, ?, ?, 1, ${activoVal}, ?, ?)`,
        {
          replacements: [horario.carrera_materia_id, horario.comision, anioActual, now, now],
          type: Sequelize.QueryTypes.INSERT,
        }
      );
      comisionMap[key] = comisionResult;
    }

    await queryInterface.sequelize.query(
      'UPDATE horarios SET comision_id = ? WHERE id = ?',
      { replacements: [comisionMap[key], horario.id] }
    );
  }

  await queryInterface.changeColumn('horarios', 'comision_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
  });

  await queryInterface.removeColumn('horarios', 'comision');
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn('horarios', 'comision', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Todas',
  });

  const horarios = await queryInterface.sequelize.query(
    `SELECT h.id, c.nombre as comision 
     FROM horarios h 
     JOIN comisiones c ON h.comision_id = c.id`,
    { type: Sequelize.QueryTypes.SELECT }
  );

  for (const horario of horarios) {
    await queryInterface.sequelize.query(
      'UPDATE horarios SET comision = ? WHERE id = ?',
      { replacements: [horario.comision, horario.id] }
    );
  }

  await queryInterface.removeColumn('horarios', 'comision_id');
  await queryInterface.dropTable('comisiones');
}
