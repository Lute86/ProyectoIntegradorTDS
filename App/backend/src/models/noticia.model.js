export default (sequelize, DataTypes) => {
  const Noticia = sequelize.define('Noticia', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagen_destacada_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'borrador',
      validate: {
        isIn: [['borrador', 'publicado', 'archivado']],
      },
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'noticias',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
      {
        fields: ['categoria_id'],
      },
      {
        fields: ['autor_id'],
      },
      {
        fields: ['estado'],
      },
      {
        fields: ['fecha_publicacion'],
      },
    ],
  });

  Noticia.associate = (models) => {
    Noticia.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
    Noticia.belongsTo(models.User, { foreignKey: 'autor_id', as: 'autor' });
  };

  return Noticia;
};
