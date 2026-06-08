export async function up(queryInterface, Sequelize) {
  try {
    const table = await queryInterface.describeTable('site_config');
    if (!table.social_links) {
      await queryInterface.addColumn('site_config', 'social_links', {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      });
    }
  } catch {
    // Table doesn't exist yet; social_links is already defined in create-siteconfig-table migration.
  }
}

export async function down(queryInterface) {
  try {
    const table = await queryInterface.describeTable('site_config');
    if (table.social_links) {
      await queryInterface.removeColumn('site_config', 'social_links');
    }
  } catch {
    // Table doesn't exist, nothing to remove.
  }
}
