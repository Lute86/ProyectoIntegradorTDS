import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET no está definido en las variables de entorno');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const login = handleDbErrors(async (email, password) => {
  const user = await models.User.findOne({ where: { email } });

  if (!user) {
    throw new UnauthorizedError('Usuario no encontrado');
  }

  if (!user.activo) {
    throw new ForbiddenError('Usuario inactivo');
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new UnauthorizedError('Contraseña incorrecta');
  }

  const payload = {
    id: user.id,
    email: user.email,
    rol: user.rol,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  await user.update({ ultimo_acceso: new Date() });

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      avatar_url: user.avatar_url,
    },
  };
});

export const refreshToken = handleDbErrors(async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await models.User.findByPk(decoded.id);

    if (!user || !user.activo) {
      throw new UnauthorizedError('Usuario no válido');
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };

    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      token: newToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        avatar_url: user.avatar_url,
      },
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token inválido o expirado');
    }
    throw error; // Re-lanzar para que handleDbErrors lo maneje
  }
});

export const hashPassword = handleDbErrors(async (password) => {
  return await bcrypt.hash(password, 10);
});
