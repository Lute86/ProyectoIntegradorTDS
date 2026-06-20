export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('site_config', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    site_name: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'IFTS 29',
    },
    site_subtitle: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Nueva Web',
    },
    contact_email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    seo_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    footer_text: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    colors: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    layout: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    sections: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    typography: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    theme_preset: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'default',
    },
    social_links: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
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

  await queryInterface.addIndex('site_config', ['id'], {
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('site_config');
}
