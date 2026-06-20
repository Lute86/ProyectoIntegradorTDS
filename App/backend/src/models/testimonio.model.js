export default (sequelize, DataTypes) => {
  const Testimonio = sequelize.define('Testimonio', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    autor_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor_carrera: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'testimonios',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['visible'],
      },
    ],
  });

  Testimonio.associate = () => {};

  return Testimonio;
};
