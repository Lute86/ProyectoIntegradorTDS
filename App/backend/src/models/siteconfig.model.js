export default (sequelize, DataTypes) => {
  const SiteConfig = sequelize.define('SiteConfig', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    site_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'IFTS 29',
    },
    site_subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Nueva Web',
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seo_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    footer_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    layout: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    typography: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    theme_preset: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'default',
    },
  }, {
    tableName: 'site_config',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['id'],
      },
    ],
  });

  SiteConfig.associate = (models) => {
  };

  return SiteConfig;
};
