import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.categoria) {
    where.categoria = filters.categoria;
  }

  if (filters.entidad_id) {
    where.entidad_id = filters.entidad_id;
  }

  const imagenes = await models.Imagen.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return imagenes;
});

export const getById = handleDbErrors(async (id) => {
  const imagen = await models.Imagen.findByPk(id);

  if (!imagen) {
    throw new NotFoundError('Imagen no encontrada');
  }

  return imagen;
});

export const create = handleDbErrors(async (data) => {
  const imagen = await models.Imagen.create(data);
  return imagen;
});

export const update = handleDbErrors(async (id, data) => {
  const imagen = await models.Imagen.findByPk(id);

  if (!imagen) {
    throw new NotFoundError('Imagen no encontrada');
  }

  if (data.url && data.url !== imagen.url) {
    const existing = await models.Imagen.findOne({ where: { url: data.url } });
    if (existing && existing.id !== id) {
      throw new ConflictError('Ya existe una imagen con esa URL');
    }
  }

  await imagen.update(data);
  return imagen;
});

export const remove = handleDbErrors(async (id) => {
  const imagen = await models.Imagen.findByPk(id);

  if (!imagen) {
    throw new NotFoundError('Imagen no encontrada');
  }

  await imagen.destroy();
  return { message: 'Imagen eliminada exitosamente' };
});
