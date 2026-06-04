import { validationResult } from 'express-validator';
import * as carreraMateriaService from '../services/carreraMateria.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAllByCarrera = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.materia_id) {
    filters.materia_id = parseInt(req.query.materia_id);
  }

  const asignaciones = await carreraMateriaService.getAllByCarrera(req.params.carreraId, filters);
  return success(res, asignaciones, 'Asignaciones obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const asignacion = await carreraMateriaService.getById(req.params.carreraId, req.params.id);
  return success(res, asignacion, 'Asignación obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const asignacion = await carreraMateriaService.create(req.params.carreraId, req.body);
  return created(res, asignacion, 'Asignación creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const asignacion = await carreraMateriaService.update(req.params.carreraId, req.params.id, req.body);
  return success(res, asignacion, 'Asignación actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  await carreraMateriaService.remove(req.params.carreraId, req.params.id);
  return deleted(res, 'Asignación eliminada exitosamente');
});
