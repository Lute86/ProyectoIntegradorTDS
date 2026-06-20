import { validationResult } from 'express-validator';
import * as categoriaService from '../services/categoria.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (_req, res) => {
  const categorias = await categoriaService.getAll();
  return success(res, categorias, 'Categorias obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const categoria = await categoriaService.getById(id);
  return success(res, categoria, 'Categoria obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const categoria = await categoriaService.create(req.body);
  return created(res, categoria, 'Categoria creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const categoria = await categoriaService.update(id, req.body);
  return success(res, categoria, 'Categoria actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await categoriaService.remove(id);
  return deleted(res, 'Categoria eliminada exitosamente');
});
