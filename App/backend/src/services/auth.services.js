import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export async function login(email, password) {
  try {
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.activo) {
      throw new Error('Usuario inactivo');
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      throw new Error('Contraseña incorrecta');
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
  } catch (error) {
    logger.error('Error en auth.service.login:', error);
    throw error;
  }
}

export async function register({ nombre, apellido, email, password, rol = 'profesor' }) {
  try {
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await models.User.create({
      nombre,
      apellido,
      email,
      password_hash: passwordHash,
      rol,
      activo: true,
    });

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

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
  } catch (error) {
    logger.error('Error en auth.service.register:', error);
    throw error;
  }
}

export async function refreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await models.User.findByPk(decoded.id);

    if (!user || !user.activo) {
      throw new Error('Usuario no válido');
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
    logger.error('Error en auth.service.refreshToken:', error);
    throw new Error('Token inválido o expirado');
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
