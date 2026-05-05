import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};
  
  if (filters.carrera_id) {
    where.carrera_id = filters.carrera_id;
  }
  
  if (filters.cuatrimestre) {
    where.cuatrimestre = filters.cuatrimestre;
  }

  const materias = await models.Materia.findAll({
    where,
    include: [
      {
        model: models.Carrera,
        as: 'carrera',
        attributes: ['id', 'nombre', 'slug'],
      },
    ],
    order: [['nombre', 'ASC']],
  });

  return materias;
});

export const getById = handleDbErrors(async (id) => {
  const materia = await models.Materia.findByPk(id, {
    include: [
      {
        model: models.Carrera,
        as: 'carrera',
        attributes: ['id', 'nombre', 'slug'],
      },
    ],
  });

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  return materia;
});

export const create = handleDbErrors(async (data) => {
  const carrera = await models.Carrera.findByPk(data.carrera_id);
  if (!carrera) {
    throw new ConflictError('La carrera especificada no existe');
  }

  const materia = await models.Materia.create(data);
  return materia;
});

export const update = handleDbErrors(async (id, data) => {
  const materia = await models.Materia.findByPk(id);

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  if (data.carrera_id && data.carrera_id !== materia.carrera_id) {
    const carrera = await models.Carrera.findByPk(data.carrera_id);
    if (!carrera) {
      throw new ConflictError('La carrera especificada no existe');
    }
  }

  await materia.update(data);
  return materia;
});

export const remove = handleDbErrors(async (id) => {
  const materia = await models.Materia.findByPk(id);

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  await materia.destroy();
  return { message: 'Materia eliminada exitosamente' };
});
