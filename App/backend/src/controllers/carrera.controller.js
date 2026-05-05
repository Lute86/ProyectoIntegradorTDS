import { validationResult } from 'express-validator';
import * as carreraService from '../services/carrera.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.modalidad) {
    filters.modalidad = req.query.modalidad;
  }

  if (req.query.activa !== undefined) {
    filters.activa = req.query.activa === 'true';
  }

  const carreras = await carreraService.getAll(filters);
  return success(res, carreras, 'Carreras obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const carrera = await carreraService.getById(id);
  return success(res, carrera, 'Carrera obtenida exitosamente');
});

export const getBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const carrera = await carreraService.getBySlug(slug);
  return success(res, carrera, 'Carrera obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const carrera = await carreraService.create(req.body);
  return created(res, carrera, 'Carrera creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const carrera = await carreraService.update(id, req.body);
  return success(res, carrera, 'Carrera actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await carreraService.remove(id);
  return deleted(res, 'Carrera eliminada exitosamente');
});
