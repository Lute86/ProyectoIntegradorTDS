import { validationResult } from 'express-validator';
import * as materiaService from '../services/materia.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.nombre) {
    filters.nombre = req.query.nombre;
  }

  const materias = await materiaService.getAll(filters);
  return success(res, materias, 'Materias obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const materia = await materiaService.getById(id);
  return success(res, materia, 'Materia obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const materia = await materiaService.create(req.body);
  return created(res, materia, 'Materia creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const materia = await materiaService.update(id, req.body);
  return success(res, materia, 'Materia actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await materiaService.remove(id);
  return deleted(res, 'Materia eliminada exitosamente');
});
