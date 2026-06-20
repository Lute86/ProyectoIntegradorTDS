import { Op } from 'sequelize';
import models from '../models/index.js';
import { NotFoundError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};
  const {
    respondido,
    search,
    page = 1,
    limit = 10,
  } = filters;

  if (respondido !== undefined) {
    where.respondido = respondido === 'true' || respondido === true;
  }

  if (search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { asunto: { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await models.Consulta.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
});

export const getById = handleDbErrors(async (id) => {
  const consulta = await models.Consulta.findByPk(id);

  if (!consulta) {
    throw new NotFoundError('Consulta no encontrada');
  }

  return consulta;
});

export const create = handleDbErrors(async (data) => {
  const consulta = await models.Consulta.create(data);
  return consulta;
});

export const update = handleDbErrors(async (id, data) => {
  const consulta = await models.Consulta.findByPk(id);

  if (!consulta) {
    throw new NotFoundError('Consulta no encontrada');
  }

  await consulta.update(data);
  return consulta;
});

export const remove = handleDbErrors(async (id) => {
  const consulta = await models.Consulta.findByPk(id);

  if (!consulta) {
    throw new NotFoundError('Consulta no encontrada');
  }

  await consulta.destroy();
  return { message: 'Consulta eliminada exitosamente' };
});

export const getUnreadCount = handleDbErrors(async () => {
  const count = await models.Consulta.count({
    where: { respondido: false },
  });

  return { count };
});
