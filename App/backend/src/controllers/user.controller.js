import { validationResult } from 'express-validator';
import * as userService from '../services/user.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.rol) {
    filters.rol = req.query.rol;
  }

  if (req.query.activo !== undefined) {
    filters.activo = req.query.activo;
  }

  const users = await userService.getAll(filters);
  return success(res, users, 'Usuarios obtenidos exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const user = await userService.getById(id);
  return success(res, user, 'Usuario obtenido exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const user = await userService.create(req.body);
  return created(res, user, 'Usuario creado exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  if (req.user.rol !== 'admin') {
    delete req.body.rol;
  }
  const user = await userService.update(id, req.body);
  return success(res, user, 'Usuario actualizado exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await userService.remove(id);
  return deleted(res, 'Usuario eliminado exitosamente');
});

export const toggleActive = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const user = await userService.toggleActive(id);
  return success(res, user, 'Estado de usuario actualizado exitosamente');
});
