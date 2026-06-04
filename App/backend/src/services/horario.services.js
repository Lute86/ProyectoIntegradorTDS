import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.materia_id) {
    where.materia_id = filters.materia_id;
  }

  if (filters.comision) {
    where.comision = filters.comision;
  }

  if (filters.dia) {
    where.dia = filters.dia;
  }

  const horarios = await models.Horario.findAll({
    where,
    include: [
      {
        model: models.Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'carrera_id'],
      },
    ],
    order: [['dia', 'ASC'], ['horario', 'ASC']],
  });

  return horarios;
});

export const getById = handleDbErrors(async (id) => {
  const horario = await models.Horario.findByPk(id, {
    include: [
      {
        model: models.Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'carrera_id'],
      },
    ],
  });

  if (!horario) {
    throw new NotFoundError('Horario no encontrado');
  }

  return horario;
});

export const create = handleDbErrors(async (data) => {
  const materia = await models.Materia.findByPk(data.materia_id);
  if (!materia) {
    throw new ConflictError('La materia especificada no existe');
  }

  const horario = await models.Horario.create(data);
  return horario;
});

export const update = handleDbErrors(async (id, data) => {
  const horario = await models.Horario.findByPk(id);

  if (!horario) {
    throw new NotFoundError('Horario no encontrado');
  }

  if (data.materia_id && data.materia_id !== horario.materia_id) {
    const materia = await models.Materia.findByPk(data.materia_id);
    if (!materia) {
      throw new ConflictError('La materia especificada no existe');
    }
  }

  await horario.update(data);
  return horario;
});

export const remove = handleDbErrors(async (id) => {
  const horario = await models.Horario.findByPk(id);

  if (!horario) {
    throw new NotFoundError('Horario no encontrado');
  }

  await horario.destroy();
  return { message: 'Horario eliminado exitosamente' };
});
