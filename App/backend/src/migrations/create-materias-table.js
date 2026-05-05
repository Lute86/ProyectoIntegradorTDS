export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('materias', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
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
    cuatrimestre: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    carga_horaria_semanal: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: Sequelize.TEXT,
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

  await queryInterface.addIndex('materias', ['carrera_id']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('materias');
}
