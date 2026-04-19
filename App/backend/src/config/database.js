require('dotenv').config()

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './data/dev.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect:  'postgres',
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging:  false,
    dialectOptions: {
      ssl: false, // cambiar a true si el proveedor lo requiere
    },
  },
}
