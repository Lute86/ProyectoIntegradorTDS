import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Materia: createModelMock(),
    Carrera: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/materia.services.js');

describe('materia.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todas las materias con carrera', async () => {
      models.Materia.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, nombre: 'TDS', carrera_id: 1 }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
      expect(models.Materia.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'carrera' }),
          ]),
        })
      );
    });

    it('deberia filtrar por carrera_id', async () => {
      models.Materia.findAll.mockResolvedValue([]);

      await getAll({ carrera_id: 1 });

      expect(models.Materia.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { carrera_id: 1 } })
      );
    });

    it('deberia filtrar por cuatrimestre', async () => {
      models.Materia.findAll.mockResolvedValue([]);

      await getAll({ cuatrimestre: 3 });

      expect(models.Materia.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { cuatrimestre: 3 } })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la materia con carrera', async () => {
      models.Materia.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Materia no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una materia si la carrera existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Materia.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS', carrera_id: 1 })
      );

      const result = await create({ nombre: 'TDS', carrera_id: 1 });

      expect(result.nombre).toBe('TDS');
    });

    it('deberia lanzar error si la carrera no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(create({ nombre: 'X', carrera_id: 999 })).rejects.toThrow(
        'La carrera especificada no existe'
      );
    });
  });

  describe('update', () => {
    it('deberia actualizar una materia existente', async () => {
      const materia = createInstanceMock({ id: 1, carrera_id: 1 });
      models.Materia.findByPk.mockResolvedValue(materia);

      await update(1, { nombre: 'Updated' });

      expect(materia.update).toHaveBeenCalled();
    });

    it('deberia validar carrera_id si cambia', async () => {
      const materia = createInstanceMock({ id: 1, carrera_id: 1 });
      models.Materia.findByPk.mockResolvedValue(materia);
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(update(1, { carrera_id: 999 })).rejects.toThrow(
        'La carrera especificada no existe'
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Materia no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una materia existente', async () => {
      const materia = createInstanceMock({ id: 1 });
      models.Materia.findByPk.mockResolvedValue(materia);

      const result = await remove(1);

      expect(materia.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Materia no encontrada');
    });
  });
});
