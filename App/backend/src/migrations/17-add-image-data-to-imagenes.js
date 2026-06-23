export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('imagenes', 'data', {
    type: Sequelize.BLOB('long'),
    allowNull: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('imagenes', 'data');
}
