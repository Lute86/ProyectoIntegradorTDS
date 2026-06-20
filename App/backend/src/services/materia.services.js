import models from '../models/index.js';
import { NotFoundError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.nombre) {
    where.nombre = { [models.Sequelize.Op.like]: `%${filters.nombre}%` };
  }

  const materias = await models.Materia.findAll({
    where,
    include: [
      {
        model: models.CarreraMateria,
        as: 'carrerasMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: models.Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
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
        model: models.CarreraMateria,
        as: 'carrerasMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: models.Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
      },
    ],
  });

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  return materia;
});

export const create = handleDbErrors(async (data) => {
  const materia = await models.Materia.create(data);
  return materia;
});

export const update = handleDbErrors(async (id, data) => {
  const materia = await models.Materia.findByPk(id);

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  await materia.update(data);
  return materia;
});

export const remove = handleDbErrors(async (id) => {
  const materia = await models.Materia.findByPk(id);

  if (!materia) {
    throw new NotFoundError('Materia no encontrada');
  }

  const asignacionesCount = await models.CarreraMateria.count({
    where: { materia_id: id },
  });
  if (asignacionesCount > 0) {
    const { ConflictError } = await import('../utils/AppError.js');
    throw new ConflictError('No se puede eliminar una materia que tiene asignaciones en carreras');
  }

  await materia.destroy();
  return { message: 'Materia eliminada exitosamente' };
});
