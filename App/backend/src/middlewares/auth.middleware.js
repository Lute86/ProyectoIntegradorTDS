import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import logger from '../utils/logger.js';
import { unauthorized, serverError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET no está definido en las variables de entorno');
}

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await models.User.findByPk(decoded.id);

    if (!user || !user.activo) {
      return unauthorized(res, 'Usuario no válido o inactivo');
    }

    req.user = {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      avatar_url: user.avatar_url,
    };

    next();
  } catch (error) {
    logger.error('Error en auth.middleware.authenticate:', error);

    if (error.name === 'JsonWebTokenError') {
      return unauthorized(res, 'Token inválido');
    }

    if (error.name === 'TokenExpiredError') {
      return unauthorized(res, 'Token expirado');
    }

    return serverError(res, 'Error interno del servidor');
  }
}
