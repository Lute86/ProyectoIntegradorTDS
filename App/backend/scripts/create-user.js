import bcrypt from 'bcryptjs';
import models from '../src/models/index.js';

const EMAIL    = process.env.EMAIL    || 'admin@ifts29.edu.ar';
const PASSWORD = process.env.PASSWORD || 'admin1234';
const ROL      = process.env.ROL      || 'admin';

async function main() {
  const { User, sequelize } = models;

  try {
    await sequelize.authenticate();
    console.log(`  DB connected`);

    const [existing] = await User.findOrCreate({
      where: { email: EMAIL },
      defaults: {
        nombre: EMAIL.split('@')[0],
        apellido: 'IFTS29',
        password_hash: await bcrypt.hash(PASSWORD, 10),
        rol: ROL,
        activo: true,
      },
    });

    if (!existing._options.isNewRecord) {
      existing.password_hash = await bcrypt.hash(PASSWORD, 10);
      existing.rol = ROL;
      await existing.save();
    }

    console.log(`  User: ${EMAIL} / ${PASSWORD} (${ROL})`);
    process.exit(0);
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    process.exit(1);
  }
}

main();
