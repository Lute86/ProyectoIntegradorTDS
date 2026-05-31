import { validationResult } from 'express-validator';
import * as consultaService from '../services/consulta.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.respondido !== undefined) {
    filters.respondido = req.query.respondido;
  }

  if (req.query.search) {
    filters.search = req.query.search;
  }

  if (req.query.page) {
    filters.page = parseInt(req.query.page);
  }

  if (req.query.limit) {
    filters.limit = parseInt(req.query.limit);
  }

  const result = await consultaService.getAll(filters);
  return success(res, result, 'Consultas obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const consulta = await consultaService.getById(id);
  return success(res, consulta, 'Consulta obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const consulta = await consultaService.create(req.body);
  return created(res, consulta, 'Consulta enviada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  const consulta = await consultaService.update(id, req.body);
  return success(res, consulta, 'Consulta actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const { id } = req.params;
  await consultaService.remove(id);
  return deleted(res, 'Consulta eliminada exitosamente');
});

export const getUnreadCount = asyncHandler(async (_req, res) => {
  const result = await consultaService.getUnreadCount();
  return success(res, result, 'Conteo de consultas sin leer obtenido exitosamente');
});
