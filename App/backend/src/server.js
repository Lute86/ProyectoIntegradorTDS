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

    if (process.env.NODE_ENV === 'production') {
      logger.info('[db] ejecutando migraciones...');
      const { execSync } = await import('child_process');
      execSync('npx sequelize-cli db:migrate', { stdio: 'inherit', cwd: import.meta.dirname });
      logger.info('[db] migraciones ejecutadas');
    }

    app.listen(PORT, () => {
      logger.info(`[server] corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('[db] error de conexión:', err.message);
    process.exit(1);
  }
}

start();
