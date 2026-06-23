export default (sequelize, DataTypes) => {
  const Imagen = sequelize.define('Imagen', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    alt_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'imagenes',
    timestamps: true,
    indexes: [
      {
        fields: ['categoria'],
      },
      {
        fields: ['entidad_id'],
      },
    ],
  });

  return Imagen;
};
