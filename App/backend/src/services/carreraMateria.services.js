import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAllByCarrera = handleDbErrors(async (carreraId, filters = {}) => {
  const carrera = await models.Carrera.findByPk(carreraId);
  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  const where = { carrera_id: carreraId };

  if (filters.materia_id) {
    where.materia_id = filters.materia_id;
  }

  const asignaciones = await models.CarreraMateria.findAll({
    where,
    include: [
      {
        model: models.Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'descripcion'],
      },
    ],
    order: [['cuatrimestre', 'ASC'], ['createdAt', 'ASC']],
  });

  return asignaciones;
});

export const getById = handleDbErrors(async (carreraId, id) => {
  const asignacion = await models.CarreraMateria.findOne({
    where: { id, carrera_id: carreraId },
    include: [
      {
        model: models.Materia,
        as: 'materia',
        attributes: ['id', 'nombre', 'descripcion'],
      },
      {
        model: models.Carrera,
        as: 'carrera',
        attributes: ['id', 'nombre', 'slug'],
      },
    ],
  });

  if (!asignacion) {
    throw new NotFoundError('Asignación no encontrada');
  }

  return asignacion;
});

export const create = handleDbErrors(async (carreraId, data) => {
  const carrera = await models.Carrera.findByPk(carreraId);
  if (!carrera) {
    throw new NotFoundError('Carrera no encontrada');
  }

  const materia = await models.Materia.findByPk(data.materia_id);
  if (!materia) {
    throw new ConflictError('La materia especificada no existe');
  }

  const existing = await models.CarreraMateria.findOne({
    where: { carrera_id: carreraId, materia_id: data.materia_id },
  });
  if (existing) {
    throw new ConflictError('La materia ya está asignada a esta carrera');
  }

  const asignacion = await models.CarreraMateria.create({
    carrera_id: carreraId,
    materia_id: data.materia_id,
    cuatrimestre: data.cuatrimestre || null,
    carga_horaria_semanal: data.carga_horaria_semanal || null,
  });

  return asignacion;
});

export const update = handleDbErrors(async (carreraId, id, data) => {
  const asignacion = await models.CarreraMateria.findOne({
    where: { id, carrera_id: carreraId },
  });

  if (!asignacion) {
    throw new NotFoundError('Asignación no encontrada');
  }

  if (data.materia_id && data.materia_id !== asignacion.materia_id) {
    const materia = await models.Materia.findByPk(data.materia_id);
    if (!materia) {
      throw new ConflictError('La materia especificada no existe');
    }

    const duplicate = await models.CarreraMateria.findOne({
      where: { carrera_id: carreraId, materia_id: data.materia_id },
    });
    if (duplicate) {
      throw new ConflictError('La materia ya está asignada a esta carrera');
    }
  }

  const allowed = {};
  if (data.materia_id !== undefined) allowed.materia_id = data.materia_id;
  if (data.cuatrimestre !== undefined) allowed.cuatrimestre = data.cuatrimestre;
  if (data.carga_horaria_semanal !== undefined) allowed.carga_horaria_semanal = data.carga_horaria_semanal;

  await asignacion.update(allowed);
  return asignacion;
});

export const remove = handleDbErrors(async (carreraId, id) => {
  const asignacion = await models.CarreraMateria.findOne({
    where: { id, carrera_id: carreraId },
  });

  if (!asignacion) {
    throw new NotFoundError('Asignación no encontrada');
  }

  const horariosCount = await models.Horario.count({
    where: { carrera_materia_id: id },
  });
  if (horariosCount > 0) {
    throw new ConflictError('No se puede eliminar una asignación que tiene horarios asociados');
  }

  await asignacion.destroy();
  return { message: 'Asignación eliminada exitosamente' };
});
