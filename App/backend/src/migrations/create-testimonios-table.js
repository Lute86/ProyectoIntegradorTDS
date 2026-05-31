export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('testimonios', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    autor_nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    autor_carrera: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    texto: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    visible: {
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

  await queryInterface.addIndex('testimonios', ['visible']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('testimonios');
}
