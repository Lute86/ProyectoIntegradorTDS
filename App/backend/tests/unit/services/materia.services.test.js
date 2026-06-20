import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Materia: createModelMock(),
    Carrera: createModelMock(),
    CarreraMateria: createModelMock(),
    Sequelize: { Op: { like: jest.fn((val) => ({ [Symbol.for('like')]: val })) } },
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/materia.services.js');

describe('materia.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todas las materias con carrerasMateria', async () => {
      models.Materia.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, nombre: 'TDS', carrerasMateria: [] }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
      expect(models.Materia.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'carrerasMateria' }),
          ]),
        })
      );
    });

    it('deberia filtrar por nombre', async () => {
      models.Materia.findAll.mockResolvedValue([]);

      await getAll({ nombre: 'Programacion' });

      expect(models.Materia.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la materia con carrerasMateria', async () => {
      models.Materia.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS', carrerasMateria: [] })
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
    it('deberia crear una materia', async () => {
      models.Materia.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS' })
      );

      const result = await create({ nombre: 'TDS' });

      expect(result.nombre).toBe('TDS');
    });
  });

  describe('update', () => {
    it('deberia actualizar una materia existente', async () => {
      const materia = createInstanceMock({ id: 1 });
      models.Materia.findByPk.mockResolvedValue(materia);

      await update(1, { nombre: 'Updated' });

      expect(materia.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Materia no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una materia sin asignaciones', async () => {
      const materia = createInstanceMock({ id: 1 });
      models.Materia.findByPk.mockResolvedValue(materia);
      models.CarreraMateria.count.mockResolvedValue(0);

      const result = await remove(1);

      expect(materia.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia bloquear eliminacion si tiene asignaciones', async () => {
      models.Materia.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.CarreraMateria.count.mockResolvedValue(3);

      await expect(remove(1)).rejects.toThrow('No se puede eliminar una materia que tiene asignaciones en carreras');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Materia.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Materia no encontrada');
    });
  });
});
