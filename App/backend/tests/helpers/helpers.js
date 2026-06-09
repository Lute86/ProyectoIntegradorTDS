import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sequelize } from '../../src/models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

export async function createUser({ nombre = 'Test', email, password = 'testpass123', rol = 'profesor' } = {}) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await sequelize.models.User.create({
    nombre,
    apellido: 'Test',
    email,
    password_hash: passwordHash,
    rol,
    activo: true,
  });
  return user;
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export async function createAndLogin({ nombre, email, password = 'testpass123', rol } = {}) {
  const user = await createUser({ nombre, email, password, rol });
  const token = generateToken(user);
  return { user, token };
}
