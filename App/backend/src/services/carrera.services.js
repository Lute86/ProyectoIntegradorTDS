import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};
  
  if (filters.modalidad) {
    where.modalidad = filters.modalidad;
  }
  
  if (filters.activa !== undefined) {
    where.activa = filters.activa;
  }

  const carreras = await models.Carrera.findAll({
    where,
    order: [['nombre', 'ASC']],
  });

  return carreras;
});

export const getById = handleDbErrors(async (id) => {
  const carrera = await models.Carrera.findByPk(id, {
    include: [
      {
        model: models.Materia,
        as: 'materias',
        attributes: ['id', 'nombre', 'cuatrimestre', 'carga_horaria_semanal'],
      },
    ],
  });

  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  return carrera;
});

export const getBySlug = handleDbErrors(async (slug) => {
  const carrera = await models.Carrera.findOne({
    where: { slug },
    include: [
      {
        model: models.Materia,
        as: 'materias',
        attributes: ['id', 'nombre', 'cuatrimestre', 'carga_horaria_semanal'],
      },
    ],
  });

  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  return carrera;
});

export const create = handleDbErrors(async (data) => {
  const existing = await models.Carrera.findOne({ where: { slug: data.slug } });  
  if (existing) {
    throw new ConflictError('Ya existe una carrera con ese slug');
  }

  const carrera = await models.Carrera.create(data);
  return carrera;
});

export const update = handleDbErrors(async (id, data) => {
  const carrera = await models.Carrera.findByPk(id);

  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  if (data.slug && data.slug !== carrera.slug) {
    const existing = await models.Carrera.findOne({ where: { slug: data.slug } });
    if (existing) {
      throw new ConflictError('Ya existe una carrera con ese slug');
    }
  }

  await carrera.update(data);
  return carrera;
});

export const remove = handleDbErrors(async (id) => {
  const carrera = await models.Carrera.findByPk(id);

  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  const materiasCount = await models.Materia.count({ where: { carrera_id: id } });  
  if (materiasCount > 0) {
    throw new ConflictError('No se puede eliminar una carrera que tiene materias asociadas');
  }

  await carrera.destroy();
  return { message: 'Carrera eliminada exitosamente' };
});
