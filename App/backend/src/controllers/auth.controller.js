import { validationResult } from 'express-validator';
import * as authService from '../services/auth.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, validationError } from '../utils/response.js';

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { email, password } = req.body;
  const result = await authService.login(email, password);

  return success(res, result, 'Login exitoso');
});

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { nombre, apellido, email, password, rol } = req.body;
  const result = await authService.register({
    nombre,
    apellido,
    email,
    password,
    rol,
  });

  return created(res, result, 'Registro exitoso');
});

export const refresh = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return validationError(res, ['Token requerido'], 'Token requerido');
  }

  const result = await authService.refreshToken(token);

  return success(res, result, 'Token renovado exitosamente');
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  return success(res, {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    rol: user.rol,
    avatar_url: user.avatar_url,
    ultimo_acceso: user.ultimo_acceso,
  }, 'Perfil obtenido exitosamente');
});
