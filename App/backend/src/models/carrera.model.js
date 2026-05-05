export default (sequelize, DataTypes) => {
  const Carrera = sequelize.define('Carrera', {
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modalidad: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['presencial', 'virtual', 'hibrida']],
      },
    },
    icono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'carreras',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
    ],
  });

  Carrera.associate = (models) => {
    // Asociaciones futuras (Materia)
  };

  return Carrera;
};
