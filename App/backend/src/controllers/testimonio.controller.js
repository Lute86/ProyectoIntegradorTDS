import { validationResult } from 'express-validator';
import * as testimonioService from '../services/testimonio.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.visible !== undefined) {
    filters.visible = req.query.visible === 'true';
  }

  const testimonios = await testimonioService.getAll(filters);
  return success(res, testimonios, 'Testimonios obtenidos exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const testimonio = await testimonioService.getById(id);
  return success(res, testimonio, 'Testimonio obtenido exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const testimonio = await testimonioService.create(req.body);
  return created(res, testimonio, 'Testimonio creado exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const testimonio = await testimonioService.update(id, req.body);
  return success(res, testimonio, 'Testimonio actualizado exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await testimonioService.remove(id);
  return deleted(res, 'Testimonio eliminado exitosamente');
});
