require('dotenv').config()
const app  = require('./app')
const { sequelize } = require('./models')

const PORT = process.env.PORT || 3000

async function start() {
  try {
    await sequelize.authenticate()
    console.log('[db] conexión establecida correctamente')
    app.listen(PORT, () => {
      console.log(`[server] corriendo en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('[db] error de conexión:', err.message)
    process.exit(1)
  }
}

start()
