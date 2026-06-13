import models from '../models/index.js';
import { NotFoundError, ConflictError } from '../utils/AppError.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

const { Comision, CarreraMateria, Carrera, User, Horario, Materia, ComisionCarreraMateria } = models;

const CARRERA_MATERIA_INCLUDE = {
  model: CarreraMateria,
  as: 'carrerasMaterias',
  attributes: ['id', 'cuatrimestre', 'carga_horaria_semanal'],
  through: { attributes: [] },
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
};

export const getAll = handleDbErrors(async (filters = {}) => {
  const where = {};

  if (filters.carrera_id) {
    where.carrera_id = filters.carrera_id;
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
      CARRERA_MATERIA_INCLUDE,
      {
        model: Carrera,
        as: 'carrera',
        attributes: ['id', 'nombre', 'slug'],
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
      CARRERA_MATERIA_INCLUDE,
      {
        model: Carrera,
        as: 'carrera',
        attributes: ['id', 'nombre', 'slug'],
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
  const { carrera_materias_ids, ...comisionData } = data;

  const carrera = await Carrera.findByPk(comisionData.carrera_id);
  if (!carrera) {
    throw new ConflictError('La carrera especificada no existe');
  }

  if (comisionData.encargado_id) {
    const encargado = await User.findByPk(comisionData.encargado_id);
    if (!encargado) {
      throw new ConflictError('El encargado especificado no existe');
    }
  }

  const comision = await Comision.create(comisionData);

  if (carrera_materias_ids && carrera_materias_ids.length > 0) {
    const validCM = await CarreraMateria.findAll({
      where: { id: carrera_materias_ids },
    });
    if (validCM.length !== carrera_materias_ids.length) {
      throw new ConflictError('Una o más asignaciones carrera-materia especificadas no existen');
    }

    const junctionRows = carrera_materias_ids.map((cmId) => ({
      comision_id: comision.id,
      carrera_materia_id: cmId,
    }));
    await ComisionCarreraMateria.bulkCreate(junctionRows);
  }

  return comision;
});

export const update = handleDbErrors(async (id, data) => {
  const comision = await Comision.findByPk(id);

  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  if (data.carrera_id && data.carrera_id !== comision.carrera_id) {
    const carrera = await Carrera.findByPk(data.carrera_id);
    if (!carrera) {
      throw new ConflictError('La carrera especificada no existe');
    }
  }

  if (data.encargado_id && data.encargado_id !== comision.encargado_id) {
    const encargado = await User.findByPk(data.encargado_id);
    if (!encargado) {
      throw new ConflictError('El encargado especificado no existe');
    }
  }

  const { carrera_materias_ids, ...comisionData } = data;
  await comision.update(comisionData);

  if (carrera_materias_ids !== undefined) {
    await ComisionCarreraMateria.destroy({ where: { comision_id: id } });

    if (carrera_materias_ids.length > 0) {
      const validCM = await CarreraMateria.findAll({
        where: { id: carrera_materias_ids },
      });
      if (validCM.length !== carrera_materias_ids.length) {
        throw new ConflictError('Una o más asignaciones carrera-materia especificadas no existen');
      }

      const junctionRows = carrera_materias_ids.map((cmId) => ({
        comision_id: id,
        carrera_materia_id: cmId,
      }));
      await ComisionCarreraMateria.bulkCreate(junctionRows);
    }
  }

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

  await ComisionCarreraMateria.destroy({ where: { comision_id: id } });
  await comision.destroy();
  return { message: 'Comisión eliminada exitosamente' };
});

export const assignMaterias = handleDbErrors(async (comisionId, carrera_materias_ids) => {
  const comision = await Comision.findByPk(comisionId);
  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  const validCM = await CarreraMateria.findAll({
    where: { id: carrera_materias_ids },
  });
  if (validCM.length !== carrera_materias_ids.length) {
    throw new ConflictError('Una o más asignaciones carrera-materia especificadas no existen');
  }

  const existing = await ComisionCarreraMateria.findAll({
    where: { comision_id: comisionId },
  });
  const existingIds = existing.map((e) => e.carrera_materia_id);
  const newIds = carrera_materias_ids.filter((id) => !existingIds.includes(id));

  if (newIds.length > 0) {
    const junctionRows = newIds.map((cmId) => ({
      comision_id: comisionId,
      carrera_materia_id: cmId,
    }));
    await ComisionCarreraMateria.bulkCreate(junctionRows);
  }

  return comision;
});

export const removeMateria = handleDbErrors(async (comisionId, carreraMateriaId) => {
  const comision = await Comision.findByPk(comisionId);
  if (!comision) {
    throw new NotFoundError('Comisión no encontrada');
  }

  const horariosCount = await Horario.count({
    where: { comision_id: comisionId, carrera_materia_id: carreraMateriaId },
  });
  if (horariosCount > 0) {
    throw new ConflictError('No se puede remover la materia: tiene horarios asociados');
  }

  const deleted = await ComisionCarreraMateria.destroy({
    where: { comision_id: comisionId, carrera_materia_id: carreraMateriaId },
  });

  if (!deleted) {
    throw new NotFoundError('La materia no está asignada a esta comisión');
  }

  return { message: 'Materia removida de la comisión exitosamente' };
});
