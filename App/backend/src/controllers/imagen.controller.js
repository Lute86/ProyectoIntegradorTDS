import { validationResult } from 'express-validator';
import * as imagenService from '../services/imagen.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.categoria) {
    filters.categoria = req.query.categoria;
  }

  if (req.query.entidad_id) {
    filters.entidad_id = parseInt(req.query.entidad_id);
  }

  const imagenes = await imagenService.getAll(filters);
  return success(res, imagenes, 'Imagenes obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const imagen = await imagenService.getById(id);
  return success(res, imagen, 'Imagen obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const data = { ...req.body };

  if (req.file) {
    data.url = `/uploads/${req.file.filename}`;
  }

  const imagen = await imagenService.create(data);
  return created(res, imagen, 'Imagen creada exitosamente');
});

export const uploadImagen = asyncHandler(async (req, res) => {
  if (!req.file) {
    return validationError(res, [{ msg: 'Debe seleccionar una imagen' }]);
  }

  const url = `/uploads/${req.file.filename}`;
  return success(res, { url, filename: req.file.filename }, 'Imagen subida exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const data = { ...req.body };

  if (req.file) {
    data.url = `/uploads/${req.file.filename}`;
  }

  const imagen = await imagenService.update(id, data);
  return success(res, imagen, 'Imagen actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await imagenService.remove(id);
  return deleted(res, 'Imagen eliminada exitosamente');
});
