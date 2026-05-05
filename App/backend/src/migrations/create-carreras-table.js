export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('carreras', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    duracion: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    modalidad: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    icono: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    activa: {
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

  await queryInterface.addIndex('carreras', ['slug'], {
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('carreras');
}
