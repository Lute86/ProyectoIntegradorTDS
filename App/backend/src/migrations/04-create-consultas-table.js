export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('consultas', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    asunto: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mensaje: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    respondido: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    respuesta: {
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
  });

  await queryInterface.addIndex('consultas', ['email']);
  await queryInterface.addIndex('consultas', ['respondido']);
  await queryInterface.addIndex('consultas', ['createdAt']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('consultas');
}
