export default (sequelize, DataTypes) => {
  const Comision = sequelize.define('Comision', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carrera_materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [1, 20],
        notEmpty: true,
      },
    },
    anio_lectivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear(),
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 2,
      },
    },
    encargado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'comisiones',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['carrera_materia_id', 'nombre', 'anio_lectivo', 'semestre'],
      },
    ],
  });

  Comision.associate = (models) => {
    Comision.belongsTo(models.CarreraMateria, { foreignKey: 'carrera_materia_id', as: 'carreraMateria' });
    Comision.belongsTo(models.User, { foreignKey: 'encargado_id', as: 'encargado' });
    Comision.hasMany(models.Horario, { foreignKey: 'comision_id', as: 'horarios' });
  };

  return Comision;
};
