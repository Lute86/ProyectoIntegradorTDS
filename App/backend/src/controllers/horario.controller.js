import { validationResult } from 'express-validator';
import * as horarioService from '../services/horario.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.carrera_materia_id) {
    filters.carrera_materia_id = parseInt(req.query.carrera_materia_id);
  }

  if (req.query.carrera_id) {
    filters.carrera_id = parseInt(req.query.carrera_id);
  }

  if (req.query.comision) {
    filters.comision = req.query.comision;
  }

  if (req.query.dia) {
    filters.dia = req.query.dia;
  }

  const horarios = await horarioService.getAll(filters);
  return success(res, horarios, 'Horarios obtenidos exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const horario = await horarioService.getById(id);
  return success(res, horario, 'Horario obtenido exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const horario = await horarioService.create(req.body);
  return created(res, horario, 'Horario creado exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const horario = await horarioService.update(id, req.body);
  return success(res, horario, 'Horario actualizado exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await horarioService.remove(id);
  return deleted(res, 'Horario eliminado exitosamente');
});
