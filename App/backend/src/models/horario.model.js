export default (sequelize, DataTypes) => {
  const Horario = sequelize.define('Horario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    carrera_materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comision_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dia: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']],
      },
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profesor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'horarios',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['carrera_materia_id'],
      },
      {
        fields: ['comision_id'],
      },
    ],
  });

  Horario.associate = (models) => {
    Horario.belongsTo(models.CarreraMateria, { foreignKey: 'carrera_materia_id', as: 'carreraMateria' });
    Horario.belongsTo(models.Comision, { foreignKey: 'comision_id', as: 'comisionInfo' });
  };

  return Horario;
};
