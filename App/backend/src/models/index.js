import { Sequelize, DataTypes } from 'sequelize';
import databaseConfig from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

let sequelizeInstance;

if (config.use_env_variable) {
  sequelizeInstance = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizeInstance = new Sequelize(config.database, config.username, config.password, config);
}

const models = {
  sequelize: sequelizeInstance,
  Sequelize,
};

// Importar modelos
import userModel from './user.model.js';
import carreraModel from './carrera.model.js';
import materiaModel from './materia.model.js';
import siteconfigModel from './siteconfig.model.js';
import categoriaModel from './categoria.model.js';
import noticiaModel from './noticia.model.js';
import eventoModel from './evento.model.js';
import testimonioModel from './testimonio.model.js';
import consultaModel from './consulta.model.js';
import horarioModel from './horario.model.js';

const User = userModel(sequelizeInstance, DataTypes);
models.User = User;

const Carrera = carreraModel(sequelizeInstance, DataTypes);
models.Carrera = Carrera;

const Materia = materiaModel(sequelizeInstance, DataTypes);
models.Materia = Materia;

const SiteConfig = siteconfigModel(sequelizeInstance, DataTypes);
models.SiteConfig = SiteConfig;

const Categoria = categoriaModel(sequelizeInstance, DataTypes);
models.Categoria = Categoria;

const Noticia = noticiaModel(sequelizeInstance, DataTypes);
models.Noticia = Noticia;

const Evento = eventoModel(sequelizeInstance, DataTypes);
models.Evento = Evento;

const Testimonio = testimonioModel(sequelizeInstance, DataTypes);
models.Testimonio = Testimonio;
const Consulta = consultaModel(sequelizeInstance, DataTypes);
models.Consulta = Consulta;

const Horario = horarioModel(sequelizeInstance, DataTypes);
models.Horario = Horario;

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelizeInstance as sequelize, Sequelize };
export default models;
