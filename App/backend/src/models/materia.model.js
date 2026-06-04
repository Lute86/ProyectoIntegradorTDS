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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'materias',
    timestamps: true,
    paranoid: true,
  });

  Materia.associate = (models) => {
    Materia.hasMany(models.CarreraMateria, { foreignKey: 'materia_id', as: 'carrerasMateria' });
  };

  return Materia;
};
