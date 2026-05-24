import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async () => {
  const categorias = await models.Categoria.findAll({
    order: [['nombre', 'ASC']],
  });

  return categorias;
});

export const getById = handleDbErrors(async (id) => {
  const categoria = await models.Categoria.findByPk(id);

  if (!categoria) {
    throw new NotFoundError('Categoria no encontrada');
  }

  return categoria;
});

export const create = handleDbErrors(async (data) => {
  const existing = await models.Categoria.findOne({ where: { slug: data.slug } });
  if (existing) {
    throw new ConflictError('Ya existe una categoria con ese slug');
  }

  const categoria = await models.Categoria.create(data);
  return categoria;
});

export const update = handleDbErrors(async (id, data) => {
  const categoria = await models.Categoria.findByPk(id);

  if (!categoria) {
    throw new NotFoundError('Categoria no encontrada');
  }

  if (data.slug && data.slug !== categoria.slug) {
    const existing = await models.Categoria.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new ConflictError('Ya existe una categoria con ese slug');
    }
  }

  await categoria.update(data);
  return categoria;
});

export const remove = handleDbErrors(async (id) => {
  const categoria = await models.Categoria.findByPk(id);

  if (!categoria) {
    throw new NotFoundError('Categoria no encontrada');
  }

  await categoria.destroy();
  return { message: 'Categoria eliminada exitosamente' };
});
