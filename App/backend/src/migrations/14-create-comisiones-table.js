export async function up(queryInterface, Sequelize) {
  const tableExists = await queryInterface.showAllTables();
  if (tableExists.includes('comisiones')) {
    return;
  }

  await queryInterface.createTable('comisiones', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carrera_materia_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'carrera_materias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    nombre: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    anio_lectivo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semestre: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    encargado_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
    },
  });

  await queryInterface.addIndex('comisiones', 
    ['carrera_materia_id', 'nombre', 'anio_lectivo', 'semestre'], 
    { unique: true }
  );
}

export async function down(queryInterface) {
  await queryInterface.dropTable('comisiones');
}
