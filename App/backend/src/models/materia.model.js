export default (sequelize, DataTypes) => {
  const Materia = sequelize.define('Materia', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cuatrimestre: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    carga_horaria_semanal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'materias',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['carrera_id'],
      },
    ],
  });

  Materia.associate = (models) => {
    Materia.belongsTo(models.Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
  };

  return Materia;
};
