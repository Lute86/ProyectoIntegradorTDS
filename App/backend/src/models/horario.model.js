export default (sequelize, DataTypes) => {
  const Horario = sequelize.define('Horario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    materia_id: {
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
        fields: ['materia_id'],
      },
      {
        fields: ['materia_id', 'comision'],
      },
    ],
  });

  Horario.associate = (models) => {
    Horario.belongsTo(models.Materia, { foreignKey: 'materia_id', as: 'materia' });
  };

  return Horario;
};
