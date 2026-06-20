export default (sequelize, DataTypes) => {
  const CarreraMateria = sequelize.define('CarreraMateria', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    materia_id: {
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
  }, {
    tableName: 'carrera_materias',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['carrera_id', 'materia_id'],
      },
    ],
  });

  CarreraMateria.associate = (models) => {
    CarreraMateria.belongsTo(models.Carrera, { foreignKey: 'carrera_id', as: 'carrera' });
    CarreraMateria.belongsTo(models.Materia, { foreignKey: 'materia_id', as: 'materia' });
  };

  return CarreraMateria;
};
