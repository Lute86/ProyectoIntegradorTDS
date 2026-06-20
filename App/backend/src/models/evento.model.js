export default (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: [['pendiente', 'confirmado', 'finalizado', 'cancelado']],
      },
    },
  }, {
    tableName: 'eventos',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['fecha'],
      },
      {
        fields: ['estado'],
      },
    ],
  });

  Evento.associate = () => {};

  return Evento;
};
