import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

const { Comision, CarreraMateria, User, Horario, Materia, Carrera } = models;

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.carrera_materia_id) {
    where.carrera_materia_id = filters.carrera_materia_id;
  }

  if (filters.carrera_id) {
    where['$carreraMateria.carrera_id$'] = filters.carrera_id;
  }

  if (filters.anio_lectivo) {
    where.anio_lectivo = filters.anio_lectivo;
  }

  if (filters.semestre) {
    where.semestre = filters.semestre;
  }

  if (filters.encargado_id) {
    where.encargado_id = filters.encargado_id;
  }

  if (filters.activo !== undefined) {
    where.activo = filters.activo;
  }

  const comisiones = await Comision.findAll({
    where,
    include: [
      {
        model: CarreraMateria,
        as: 'carreraMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: Materia,
            as: 'materia',
            attributes: ['id', 'nombre'],
          },
          {
            model: Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
      },
      {
        model: User,
        as: 'encargado',
        attributes: ['id', 'nombre', 'apellido', 'email', 'rol'],
      },
    ],
    order: [['anio_lectivo', 'DESC'], ['semestre', 'ASC'], ['nombre', 'ASC']],
  });

  return comisiones;
});

export const getById = handleDbErrors(async (id) => {
  const comision = await Comision.findByPk(id, {
    include: [
      {
        model: CarreraMateria,
        as: 'carreraMateria',
        attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
        include: [
          {
            model: Materia,
            as: 'materia',
            attributes: ['id', 'nombre'],
          },
          {
            model: Carrera,
            as: 'carrera',
            attributes: ['id', 'nombre', 'slug'],
          },
        ],
      },
      {
        model: User,
        as: 'encargado',
        attributes: ['id', 'nombre', 'apellido', 'email', 'rol'],
      },
      {
        model: Horario,
        as: 'horarios',
      },
    ],
  });

  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  return comision;
});

export const create = handleDbErrors(async (data) => {
  const carreraMateria = await CarreraMateria.findByPk(data.carrera_materia_id);
  if (!carreraMateria) {
    throw new ConflictError('La asignación carrera-materia especificada no existe');
  }

  if (data.encargado_id) {
    const encargado = await User.findByPk(data.encargado_id);
    if (!encargado) {
      throw new ConflictError('El encargado especificado no existe');
    }
  }

  const comision = await Comision.create(data);
  return comision;
});

export const update = handleDbErrors(async (id, data) => {
  const comision = await Comision.findByPk(id);

  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  if (data.carrera_materia_id && data.carrera_materia_id !== comision.carrera_materia_id) {
    const carreraMateria = await CarreraMateria.findByPk(data.carrera_materia_id);
    if (!carreraMateria) {
      throw new ConflictError('La asignación carrera-materia especificada no existe');
    }
  }

  if (data.encargado_id && data.encargado_id !== comision.encargado_id) {
    const encargado = await User.findByPk(data.encargado_id);
    if (!encargado) {
      throw new ConflictError('El encargado especificado no existe');
    }
  }

  await comision.update(data);
  return comision;
});

export const remove = handleDbErrors(async (id) => {
  const comision = await Comision.findByPk(id);

  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  const horariosCount = await Horario.count({ where: { comision_id: id } });
  if (horariosCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene horarios asociados');
  }

  await comision.destroy();
  return { message: 'Comisión eliminada exitosamente' };
});
