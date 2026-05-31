export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('horarios', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    comision: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Todas',
    },
    dia: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    horario: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    aula: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profesor: {
      type: Sequelize.STRING,
      allowNull: true,
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
      allowNull: true,
    },
  });

  await queryInterface.addIndex('horarios', ['materia_id']);
  await queryInterface.addIndex('horarios', ['materia_id', 'comision']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('horarios');
}
