import { validationResult } from 'express-validator';
import * as eventoService from '../services/evento.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.estado) {
    filters.estado = req.query.estado;
  }

  if (req.query.fecha_desde) {
    filters.fecha_desde = req.query.fecha_desde;
  }

  if (req.query.fecha_hasta) {
    filters.fecha_hasta = req.query.fecha_hasta;
  }

  const eventos = await eventoService.getAll(filters);
  return success(res, eventos, 'Eventos obtenidos exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const evento = await eventoService.getById(id);
  return success(res, evento, 'Evento obtenido exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const evento = await eventoService.create(req.body);
  return created(res, evento, 'Evento creado exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const evento = await eventoService.update(id, req.body);
  return success(res, evento, 'Evento actualizado exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await eventoService.remove(id);
  return deleted(res, 'Evento eliminado exitosamente');
});
