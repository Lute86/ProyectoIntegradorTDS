import { Op } from 'sequelize';
import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.estado) {
    where.estado = filters.estado;
  }

  if (filters.fecha_desde) {
    where.fecha = { ...where.fecha, [Op.gte]: filters.fecha_desde };
  }

  if (filters.fecha_hasta) {
    where.fecha = { ...where.fecha, [Op.lte]: filters.fecha_hasta };
  }

  const eventos = await models.Evento.findAll({
    where,
    order: [['fecha', 'ASC']],
  });

  return eventos;
});

export const getById = handleDbErrors(async (id) => {
  const evento = await models.Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento no encontrado');
  }

  return evento;
});

export const create = handleDbErrors(async (data) => {
  const evento = await models.Evento.create(data);
  return evento;
});

export const update = handleDbErrors(async (id, data) => {
  const evento = await models.Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento no encontrado');
  }

  if (data.nombre && data.nombre !== evento.nombre) {
    const existing = await models.Evento.findOne({ where: { nombre: data.nombre } });
    if (existing) {
      throw new ConflictError('Ya existe un evento con ese nombre');
    }
  }

  await evento.update(data);
  return evento;
});

export const remove = handleDbErrors(async (id) => {
  const evento = await models.Evento.findByPk(id);

  if (!evento) {
    throw new NotFoundError('Evento no encontrado');
  }

  await evento.destroy();
  return { message: 'Evento eliminado exitosamente' };
});
