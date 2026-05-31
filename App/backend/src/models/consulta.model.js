export default (sequelize, DataTypes) => {
  const Consulta = sequelize.define('Consulta', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    respondido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'consultas',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['respondido'] },
      { fields: ['createdAt'] },
    ],
  });

  Consulta.associate = () => {};

  return Consulta;
};
