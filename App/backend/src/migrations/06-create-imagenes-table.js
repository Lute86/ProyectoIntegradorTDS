export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('imagenes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alt_text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    categoria: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    entidad_id: {
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
  });

  await queryInterface.addIndex('imagenes', ['categoria']);
  await queryInterface.addIndex('imagenes', ['entidad_id']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('imagenes');
}
