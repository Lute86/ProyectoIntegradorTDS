export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('noticias', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contenido: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    imagen_destacada_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    categoria_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'categorias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    autor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'borrador',
    },
    fecha_publicacion: {
      type: Sequelize.DATE,
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

  await queryInterface.addIndex('noticias', ['slug'], { unique: true });
  await queryInterface.addIndex('noticias', ['categoria_id']);
  await queryInterface.addIndex('noticias', ['autor_id']);
  await queryInterface.addIndex('noticias', ['estado']);
  await queryInterface.addIndex('noticias', ['fecha_publicacion']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('noticias');
}
