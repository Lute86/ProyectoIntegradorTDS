import models from '../models/index.js';
import { NotFoundError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.visible !== undefined) {
    where.visible = filters.visible;
  }

  const testimonios = await models.Testimonio.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  return testimonios;
});

export const getById = handleDbErrors(async (id) => {
  const testimonio = await models.Testimonio.findByPk(id);

  if (!testimonio) {
    throw new NotFoundError('Testimonio no encontrado');
  }

  return testimonio;
});

export const create = handleDbErrors(async (data) => {
  const testimonio = await models.Testimonio.create(data);
  return testimonio;
});

export const update = handleDbErrors(async (id, data) => {
  const testimonio = await models.Testimonio.findByPk(id);

  if (!testimonio) {
    throw new NotFoundError('Testimonio no encontrado');
  }

  await testimonio.update(data);
  return testimonio;
});

export const remove = handleDbErrors(async (id) => {
  const testimonio = await models.Testimonio.findByPk(id);

  if (!testimonio) {
    throw new NotFoundError('Testimonio no encontrado');
  }

  await testimonio.destroy();
  return { message: 'Testimonio eliminado exitosamente' };
});
