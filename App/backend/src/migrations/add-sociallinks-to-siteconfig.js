export async function up(queryInterface, Sequelize) {
  const table = await queryInterface.describeTable('site_config');
  if (!table.social_links) {
    await queryInterface.addColumn('site_config', 'social_links', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
    });
  }
}

export async function down(queryInterface) {
  const table = await queryInterface.describeTable('site_config');
  if (table.social_links) {
    await queryInterface.removeColumn('site_config', 'social_links');
  }
}
