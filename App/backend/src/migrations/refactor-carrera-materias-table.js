export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('carrera_materias', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carrera_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'carreras',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    materia_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'materias',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    cuatrimestre: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    carga_horaria_semanal: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  const [materias] = await queryInterface.sequelize.query(
    'SELECT id, carrera_id, cuatrimestre, carga_horaria_semanal FROM materias'
  );

  if (materias && materias.length > 0) {
    const now = new Date();
    const registros = materias.map((m) => ({
      carrera_id: m.carrera_id,
      materia_id: m.id,
      cuatrimestre: m.cuatrimestre,
      carga_horaria_semanal: m.carga_horaria_semanal,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert('carrera_materias', registros);

    await queryInterface.addColumn('horarios', 'carrera_materia_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE horarios SET carrera_materia_id = (
        SELECT cm.id FROM carrera_materias cm WHERE cm.materia_id = horarios.materia_id
      )
    `);

    await queryInterface.removeConstraint('horarios', 'horarios_ibfk_1').catch(() => {});
    await queryInterface.removeIndex('horarios', ['materia_id']).catch(() => {});
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_horarios_materia_id_comision ON horarios').catch(() => {});
    await queryInterface.removeColumn('horarios', 'materia_id');

    await queryInterface.changeColumn('horarios', 'carrera_materia_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'carrera_materias',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addIndex('horarios', ['carrera_materia_id']);
    await queryInterface.addIndex('horarios', ['carrera_materia_id', 'comision']);

    await queryInterface.removeIndex('materias', ['carrera_id']).catch(() => {});
    await queryInterface.removeColumn('materias', 'carrera_id');
    await queryInterface.removeColumn('materias', 'cuatrimestre');
    await queryInterface.removeColumn('materias', 'carga_horaria_semanal');
  } else {
    await queryInterface.addColumn('horarios', 'carrera_materia_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'carrera_materias',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.removeConstraint('horarios', 'horarios_ibfk_1').catch(() => {});
    await queryInterface.removeIndex('horarios', ['materia_id']).catch(() => {});
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_horarios_materia_id_comision ON horarios').catch(() => {});
    await queryInterface.removeColumn('horarios', 'materia_id');

    await queryInterface.addIndex('horarios', ['carrera_materia_id']);
    await queryInterface.addIndex('horarios', ['carrera_materia_id', 'comision']);

    await queryInterface.removeIndex('materias', ['carrera_id']).catch(() => {});
    await queryInterface.removeColumn('materias', 'carrera_id');
    await queryInterface.removeColumn('materias', 'cuatrimestre');
    await queryInterface.removeColumn('materias', 'carga_horaria_semanal');
  }
}

export async function down(queryInterface) {
  await queryInterface.dropTable('carrera_materias');
}
