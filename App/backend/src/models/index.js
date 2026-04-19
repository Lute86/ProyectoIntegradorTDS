'use strict'
const { Sequelize } = require('sequelize')
const config = require('../config/database')

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

const sequelize = dbConfig.dialect === 'sqlite'
  ? new Sequelize({ ...dbConfig })
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, { ...dbConfig })

const db = { sequelize, Sequelize }

// TODO: importar y asociar modelos aquí a medida que se implementen
// const User = require('./User')(sequelize, Sequelize.DataTypes)
// db.User = User

module.exports = db
