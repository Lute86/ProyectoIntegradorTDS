import { validationResult } from 'express-validator';
import * as authService from '../services/auth.services.js';
import logger from '../utils/logger.js';

export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: result,
    });
  } catch (error) {
    logger.error('Error en auth.controller.login:', error);

    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    if (error.message === 'Usuario inactivo') {
      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}

export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, apellido, email, password, rol } = req.body;
    const result = await authService.register({
      nombre,
      apellido,
      email,
      password,
      rol,
    });

    return res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      data: result,
    });
  } catch (error) {
    logger.error('Error en auth.controller.register:', error);

    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}

export async function refresh(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido',
      });
    }

    const result = await authService.refreshToken(token);

    return res.status(200).json({
      success: true,
      message: 'Token renovado exitosamente',
      data: result,
    });
  } catch (error) {
    logger.error('Error en auth.controller.refresh:', error);

    return res.status(401).json({
      success: false,
      message: error.message || 'Token inválido',
    });
  }
}

export async function getProfile(req, res) {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        avatar_url: user.avatar_url,
        ultimo_acceso: user.ultimo_acceso,
      },
    });
  } catch (error) {
    logger.error('Error en auth.controller.getProfile:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
}
