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

  const mapped = imagenes.map((img) => {
    const json = img.toJSON();
    json.url = `/api/imagenes/${json.id}/data`;
    return json;
  });

  return success(res, mapped, 'Imagenes obtenidas exitosamente');
});

export const getById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const imagen = await imagenService.getById(id);
  const json = imagen.toJSON();
  json.url = `/api/imagenes/${json.id}/data`;
  return success(res, json, 'Imagen obtenida exitosamente');
});

export const create = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const data = { ...req.body };

  if (req.file) {
    data.url = `/uploads/${req.file.originalname}`;
  }

  const fileBuffer = req.file?.buffer || null;
  const imagen = await imagenService.create(data, fileBuffer);
  const json = imagen.toJSON();
  json.url = `/api/imagenes/${json.id}/data`;
  return created(res, json, 'Imagen creada exitosamente');
});

export const uploadImagen = asyncHandler(async (req, res) => {
  if (!req.file) {
    return validationError(res, [{ msg: 'Debe seleccionar una imagen' }]);
  }

  const data = {
    url: `/uploads/${req.file.originalname}`,
    titulo: req.body.titulo || req.file.originalname,
  };

  const fileBuffer = req.file?.buffer || null;
  const imagen = await imagenService.create(data, fileBuffer);
  const json = imagen.toJSON();
  json.url = `/api/imagenes/${json.id}/data`;
  return success(res, { url: json.url, filename: req.file.originalname }, 'Imagen subida exitosamente');
});

export const update = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  const data = { ...req.body };

  if (req.file) {
    data.url = `/uploads/${req.file.originalname}`;
  }

  const fileBuffer = req.file?.buffer || null;
  const imagen = await imagenService.update(id, data, fileBuffer);
  const json = imagen.toJSON();
  json.url = `/api/imagenes/${json.id}/data`;
  return success(res, json, 'Imagen actualizada exitosamente');
});

export const remove = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());
  const { id } = req.params;
  await imagenService.remove(id);
  return deleted(res, 'Imagen eliminada exitosamente');
});

export const getImageData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const imagen = await imagenService.getById(id);

  if (!imagen.data) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  const buffer = Buffer.isBuffer(imagen.data)
    ? imagen.data
    : Buffer.from(imagen.data);

  const ext = imagen.url?.split('.').pop()?.toLowerCase() || 'png';
  const mimeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  const contentType = mimeMap[ext] || 'application/octet-stream';

  res.set('Content-Type', contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  return res.send(buffer);
});
