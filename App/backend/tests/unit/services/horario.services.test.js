import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Horario: createModelMock(),
    Materia: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/horario.services.js');

describe('horario.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todos los horarios con materia', async () => {
      models.Horario.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, materia_id: 1, dia: 'Lunes' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'materia' }),
          ]),
        })
      );
    });

    it('deberia filtrar por materia_id', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ materia_id: 1 });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { materia_id: 1 } })
      );
    });

    it('deberia filtrar por dia', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ dia: 'Lunes' });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { dia: 'Lunes' } })
      );
    });

    it('deberia filtrar por comision', async () => {
      models.Horario.findAll.mockResolvedValue([]);

      await getAll({ comision: 'A' });

      expect(models.Horario.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { comision: 'A' } })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar el horario con materia', async () => {
      models.Horario.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, materia_id: 1 })
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
    it('deberia crear un horario si la materia existe', async () => {
      models.Materia.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Horario.create.mockResolvedValue(
        createInstanceMock({ id: 1, materia_id: 1, dia: 'Lunes' })
      );

      const result = await create({ materia_id: 1, dia: 'Lunes', horario: '10:00', aula: 'A1' });

      expect(result.dia).toBe('Lunes');
    });

    it('deberia lanzar error si la materia no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(create({ materia_id: 999 })).rejects.toThrow(
        'La materia especificada no existe'
      );
    });
  });

  describe('update', () => {
    it('deberia actualizar un horario existente', async () => {
      const horario = createInstanceMock({ id: 1, materia_id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);

      await update(1, { dia: 'Martes' });

      expect(horario.update).toHaveBeenCalled();
    });

    it('deberia validar materia_id si cambia', async () => {
      const horario = createInstanceMock({ id: 1, materia_id: 1 });
      models.Horario.findByPk.mockResolvedValue(horario);
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(update(1, { materia_id: 999 })).rejects.toThrow(
        'La materia especificada no existe'
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
