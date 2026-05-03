import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import models from './models/index.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await models.sequelize.authenticate();
    logger.info('[db] conexión establecida correctamente');
    
    app.listen(PORT, () => {
      logger.info(`[server] corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('[db] error de conexión:', err.message);
    process.exit(1);
  }
}

start();
