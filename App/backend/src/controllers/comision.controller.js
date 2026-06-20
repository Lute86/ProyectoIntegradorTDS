import { validationResult } from 'express-validator';
import * as comisionService from '../services/comision.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.carrera_id) {
    filters.carrera_id = parseInt(req.query.carrera_id);
  }

  if (req.query.anio_lectivo) {
    filters.anio_lectivo = parseInt(req.query.anio_lectivo);
  }

  if (req.query.semestre) {
    filters.semestre = parseInt(req.query.semestre);
  }

  if (req.query.encargado_id) {
    filters.encargado_id = parseInt(req.query.encargado_id);
  }

  if (req.query.activo !== undefined) {
    filters.activo = req.query.activo === 'true';
  }

  const comisiones = await comisionService.getAll(filters);
  return success(res, comisiones, 'Comisiones obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const comision = await comisionService.getById(id);
  return success(res, comision, 'Comisión obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const comision = await comisionService.create(req.body);
  return created(res, comision, 'Comisión creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const comision = await comisionService.update(id, req.body);
  return success(res, comision, 'Comisión actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await comisionService.remove(id);
  return deleted(res, 'Comisión eliminada exitosamente');
});

export const assignMaterias = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const { carrera_materias_ids } = req.body;
  const comision = await comisionService.assignMaterias(id, carrera_materias_ids);
  return success(res, comision, 'Materias asignadas exitosamente');
});

export const removeMateria = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id, carreraMateriaId } = req.params;
  await comisionService.removeMateria(id, parseInt(carreraMateriaId));
  return deleted(res, 'Materia removida de la comisión exitosamente');
});
