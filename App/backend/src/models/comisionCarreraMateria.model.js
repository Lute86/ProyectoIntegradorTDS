export default (sequelize, DataTypes) => {
  const ComisionCarreraMateria = sequelize.define('ComisionCarreraMateria', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  }, {
    tableName: 'comision_carrera_materias',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['comision_id', 'carrera_materia_id'],
      },
    ],
  });

  ComisionCarreraMateria.associate = (models) => {
    ComisionCarreraMateria.belongsTo(models.Comision, { foreignKey: 'comision_id', as: 'comision' });
    ComisionCarreraMateria.belongsTo(models.CarreraMateria, { foreignKey: 'carrera_materia_id', as: 'carreraMateria' });
  };

  return ComisionCarreraMateria;
};
