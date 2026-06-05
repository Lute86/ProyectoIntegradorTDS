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
    comision: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Todas',
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
        fields: ['carrera_materia_id', 'comision'],
      },
    ],
  });

  Horario.associate = (models) => {
    Horario.belongsTo(models.CarreraMateria, { foreignKey: 'carrera_materia_id', as: 'carreraMateria' });
  };

  return Horario;
};
