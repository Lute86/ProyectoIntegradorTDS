import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Horario: createModelMock(),
    CarreraMateria: createModelMock(),
    Comision: createModelMock(),
    Materia: createModelMock(),
    Carrera: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/horario.services.js');

describe('horario.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todos los horarios con carreraMateria', async () => {
      models.Horario.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, carrera_materia_id: 1, dia: 'Lunes' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'carreraMateria' }),
          ]),
        })
      );
    });

    it('deberia filtrar por carrera_materia_id', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ carrera_materia_id: 1 });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { carrera_materia_id: 1 } })
      );
    });

    it('deberia filtrar por dia', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ dia: 'Lunes' });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { dia: 'Lunes' } })
      );
    });

    it('deberia filtrar por comision_id', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ comision_id: 1 });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { comision_id: 1 } })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar el horario con carreraMateria', async () => {
      models.Horario.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, carrera_materia_id: 1 })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Horario.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('create', () => {
    it('deberia crear un horario si la carrera_materia y comision existen', async () => {
      models.CarreraMateria.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Comision.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Horario.create.mockResolvedValue(
        createInstanceMock({ id: 1, carrera_materia_id: 1, comision_id: 1, dia: 'Lunes' })
      );

      const result = await create({ carrera_materia_id: 1, comision_id: 1, dia: 'Lunes', horario: '10:00', aula: 'A1' });

      expect(result.dia).toBe('Lunes');
    });

    it('deberia crear un horario sin comision_id (opcional)', async () => {
      models.CarreraMateria.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Horario.create.mockResolvedValue(
        createInstanceMock({ id: 1, carrera_materia_id: 1, dia: 'Lunes' })
      );

      const result = await create({ carrera_materia_id: 1, dia: 'Lunes', horario: '10:00', aula: 'A1' });

      expect(result.dia).toBe('Lunes');
    });

    it('deberia lanzar error si la carrera_materia no existe', async () => {
      models.CarreraMateria.findByPk.mockResolvedValue(null);

      await expect(create({ carrera_materia_id: 999 })).rejects.toThrow(
        'La asignación carrera-materia especificada no existe'
      );
    });

    it('deberia lanzar error si la comision no existe', async () => {
      models.CarreraMateria.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Comision.findByPk.mockResolvedValue(null);

      await expect(create({ carrera_materia_id: 1, comision_id: 999 })).rejects.toThrow(
        'La comisión especificada no existe'
      );
    });
  });

  describe('update', () => {
    it('deberia actualizar un horario existente', async () => {
      const horario = createInstanceMock({ id: 1, carrera_materia_id: 1, comision_id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);

      await update(1, { dia: 'Martes' });

      expect(horario.update).toHaveBeenCalled();
    });

    it('deberia validar carrera_materia_id si cambia', async () => {
      const horario = createInstanceMock({ id: 1, carrera_materia_id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);
      models.CarreraMateria.findByPk.mockResolvedValue(null);

      await expect(update(1, { carrera_materia_id: 999 })).rejects.toThrow(
        'La asignación carrera-materia especificada no existe'
      );
    });

    it('deberia validar comision_id si cambia', async () => {
      const horario = createInstanceMock({ id: 1, carrera_materia_id: 1, comision_id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);
      models.Comision.findByPk.mockResolvedValue(null);

      await expect(update(1, { comision_id: 999 })).rejects.toThrow(
        'La comisión especificada no existe'
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.Horario.findByPk.mockResolvedValue(null);

      await expect(update(999, { dia: 'X' })).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('remove', () => {
    it('deberia eliminar un horario existente', async () => {
      const horario = createInstanceMock({ id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);

      const result = await remove(1);

      expect(horario.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminado');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Horario.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Horario no encontrado');
    });
  });
});
