import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    CarreraMateria: createModelMock(),
    Carrera: createModelMock(),
    Materia: createModelMock(),
    Horario: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAllByCarrera, getById, create, update, remove } = await import('../../../src/services/carreraMateria.services.js');

describe('carreraMateria.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllByCarrera', () => {
    it('deberia retornar asignaciones de una carrera', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.CarreraMateria.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, carrera_id: 1, materia_id: 1, cuatrimestre: 1 }),
      ]);

      const result = await getAllByCarrera(1);

      expect(result).toHaveLength(1);
      expect(models.CarreraMateria.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { carrera_id: 1 },
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'materia' }),
          ]),
        })
      );
    });

    it('deberia lanzar error si la carrera no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(getAllByCarrera(999)).rejects.toThrow('Carrera no encontrada');
    });

    it('deberia filtrar por materia_id', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.CarreraMateria.findAll.mockResolvedValue([]);

      await getAllByCarrera(1, { materia_id: 5 });

      expect(models.CarreraMateria.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { carrera_id: 1, materia_id: 5 } })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la asignacion con materia y carrera', async () => {
      models.CarreraMateria.findOne.mockResolvedValue(
        createInstanceMock({ id: 1, carrera_id: 1, materia_id: 1 })
      );

      const result = await getById(1, 1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.CarreraMateria.findOne.mockResolvedValue(null);

      await expect(getById(1, 999)).rejects.toThrow('Asignación no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una asignacion si carrera y materia existen', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Materia.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.CarreraMateria.findOne.mockResolvedValue(null);
      models.CarreraMateria.create.mockResolvedValue(
        createInstanceMock({ id: 1, carrera_id: 1, materia_id: 1, cuatrimestre: 1 })
      );

      const result = await create(1, { materia_id: 1, cuatrimestre: 1 });

      expect(result.carrera_id).toBe(1);
    });

    it('deberia lanzar error si la carrera no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(create(999, { materia_id: 1 })).rejects.toThrow('Carrera no encontrada');
    });

    it('deberia lanzar error si la materia no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(create(1, { materia_id: 999 })).rejects.toThrow('La materia especificada no existe');
    });

    it('deberia lanzar error si ya existe la asignacion', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Materia.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.CarreraMateria.findOne.mockResolvedValue(createInstanceMock({ id: 1 }));

      await expect(create(1, { materia_id: 1 })).rejects.toThrow('La materia ya está asignada a esta carrera');
    });
  });

  describe('update', () => {
    it('deberia actualizar una asignacion existente', async () => {
      const asignacion = createInstanceMock({ id: 1, carrera_id: 1, materia_id: 1 });
      models.CarreraMateria.findOne.mockResolvedValue(asignacion);

      await update(1, 1, { cuatrimestre: 2 });

      expect(asignacion.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.CarreraMateria.findOne.mockResolvedValue(null);

      await expect(update(1, 999, { cuatrimestre: 2 })).rejects.toThrow('Asignación no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una asignacion sin horarios', async () => {
      const asignacion = createInstanceMock({ id: 1, carrera_id: 1 });
      models.CarreraMateria.findOne.mockResolvedValue(asignacion);
      models.Horario.count.mockResolvedValue(0);

      const result = await remove(1, 1);

      expect(asignacion.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia bloquear eliminacion si tiene horarios', async () => {
      models.CarreraMateria.findOne.mockResolvedValue(createInstanceMock({ id: 1, carrera_id: 1 }));
      models.Horario.count.mockResolvedValue(3);

      await expect(remove(1, 1)).rejects.toThrow('No se puede eliminar una asignación que tiene horarios asociados');
    });

    it('deberia lanzar error si no existe', async () => {
      models.CarreraMateria.findOne.mockResolvedValue(null);

      await expect(remove(1, 999)).rejects.toThrow('Asignación no encontrada');
    });
  });
});
