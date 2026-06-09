export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('eventos', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    fecha: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    ubicacion: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pendiente',
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

  await queryInterface.addIndex('eventos', ['fecha']);
  await queryInterface.addIndex('eventos', ['estado']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('eventos');
}
