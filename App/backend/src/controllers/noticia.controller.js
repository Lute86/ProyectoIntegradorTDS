import { validationResult } from 'express-validator';
import * as noticiaService from '../services/noticia.services.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { success, created, deleted, validationError } from '../utils/response.js';

export const getAll = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.categoria_id) {
    filters.categoria_id = parseInt(req.query.categoria_id);
  }

  if (req.query.estado) {
    filters.estado = req.query.estado;
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

  const result = await noticiaService.getAll(filters);
  return success(res, result, 'Noticias obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const noticia = await noticiaService.getById(id);
  return success(res, noticia, 'Noticia obtenida exitosamente');
});

export const getBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const noticia = await noticiaService.getBySlug(slug);
  return success(res, noticia, 'Noticia obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const data = { ...req.body, autor_id: req.body.autor_id || req.user.id };
  const noticia = await noticiaService.create(data);
  return created(res, noticia, 'Noticia creada exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const noticia = await noticiaService.update(id, req.body);
  return success(res, noticia, 'Noticia actualizada exitosamente');
});

export const uploadImagen = asyncHandler(async (req, res) => {
  if (!req.file) {
    return validationError(res, [{ msg: 'Debe seleccionar una imagen' }]);
  }

  const url = `/uploads/${req.file.filename}`;
  return success(res, { url, filename: req.file.filename }, 'Imagen subida exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await noticiaService.remove(id);
  return deleted(res, 'Noticia eliminada exitosamente');
});
