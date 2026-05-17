export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'categorias',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
    ],
  });

  Categoria.associate = () => {};

  return Categoria;
};
