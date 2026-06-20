import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.carrera_materia_id) {
    where.carrera_materia_id = filters.carrera_materia_id;
  }

  if (filters.carrera_id) {
    where['$carreraMateria.carrera_id$'] = filters.carrera_id;
  }

  if (filters.comision_id) {
    where.comision_id = filters.comision_id;
  }

  if (filters.dia) {
    where.dia = filters.dia;
  }

  const horarios = await models.Horario.findAll({
    where,
    include: [
      {
        model: models.CarreraMateria,
        as: 'carreraMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: models.Materia,
            as: 'materia',
            attributes: ['id', 'nombre'],
          },
          {
            model: models.Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
      },
      {
        model: models.Comision,
        as: 'comisionInfo',
        attributes: ['id', 'nombre', 'anio_lectivo', 'semestre'],
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
        model: models.CarreraMateria,
        as: 'carreraMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: models.Materia,
            as: 'materia',
            attributes: ['id', 'nombre'],
          },
          {
            model: models.Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
      },
      {
        model: models.Comision,
        as: 'comisionInfo',
        attributes: ['id', 'nombre', 'anio_lectivo', 'semestre'],
      },
    ],
  });

  if (!horario) {
    throw new NotFoundError('Horario no encontrado');
  }

  return horario;
});

export const create = handleDbErrors(async (data) => {
  const carreraMateria = await models.CarreraMateria.findByPk(data.carrera_materia_id);
  if (!carreraMateria) {
    throw new ConflictError('La asignación carrera-materia especificada no existe');
  }

  if (data.comision_id) {
    const comision = await models.Comision.findByPk(data.comision_id);
    if (!comision) {
      throw new ConflictError('La comisión especificada no existe');
    }

    const pairExists = await models.ComisionCarreraMateria.findOne({
      where: { comision_id: data.comision_id, carrera_materia_id: data.carrera_materia_id },
    });
    if (!pairExists) {
      throw new ConflictError('La materia no está asignada a esta comisión. Asignala primero desde POST /api/comisiones/:id/materias');
    }
  }

  const horario = await models.Horario.create(data);
  return horario;
});

export const update = handleDbErrors(async (id, data) => {
  const horario = await models.Horario.findByPk(id);

  if (!horario) {
    throw new NotFoundError('Horario no encontrado');
  }

  if (data.carrera_materia_id && data.carrera_materia_id !== horario.carrera_materia_id) {
    const carreraMateria = await models.CarreraMateria.findByPk(data.carrera_materia_id);
    if (!carreraMateria) {
      throw new ConflictError('La asignación carrera-materia especificada no existe');
    }
  }

  if (data.comision_id && data.comision_id !== horario.comision_id) {
    const comision = await models.Comision.findByPk(data.comision_id);
    if (!comision) {
      throw new ConflictError('La comisión especificada no existe');
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
