import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Carrera: createModelMock(),
    Materia: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, getBySlug, create, update, remove } = await import('../../../src/services/carrera.services.js');

describe('carrera.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todas las carreras', async () => {
      models.Carrera.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, nombre: 'TDS' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
      expect(models.Carrera.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['nombre', 'ASC']] })
      );
    });

    it('deberia filtrar por modalidad', async () => {
      models.Carrera.findAll.mockResolvedValue([]);

      await getAll({ modalidad: 'virtual' });

      expect(models.Carrera.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { modalidad: 'virtual' } })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la carrera con materias', async () => {
      models.Carrera.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
      expect(models.Carrera.findByPk).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'materias' }),
          ]),
        })
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Carrera no encontrada');
    });
  });

  describe('getBySlug', () => {
    it('deberia retornar la carrera por slug', async () => {
      models.Carrera.findOne.mockResolvedValue(
        createInstanceMock({ id: 1, slug: 'tds' })
      );

      const result = await getBySlug('tds');

      expect(result.slug).toBe('tds');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Carrera.findOne.mockResolvedValue(null);

      await expect(getBySlug('no-existe')).rejects.toThrow('Carrera no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una carrera con slug unico', async () => {
      models.Carrera.findOne.mockResolvedValue(null);
      models.Carrera.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'TDS', slug: 'tds' })
      );

      const result = await create({ nombre: 'TDS', slug: 'tds' });

      expect(result.nombre).toBe('TDS');
    });

    it('deberia lanzar error si el slug ya existe', async () => {
      models.Carrera.findOne.mockResolvedValue({ id: 1 });

      await expect(create({ slug: 'tds' })).rejects.toThrow('Ya existe una carrera con ese slug');
    });
  });

  describe('update', () => {
    it('deberia actualizar una carrera existente', async () => {
      const carrera = createInstanceMock({ id: 1, slug: 'tds' });
      models.Carrera.findByPk.mockResolvedValue(carrera);

      const result = await update(1, { nombre: 'New Name' });

      expect(carrera.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Carrera no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una carrera sin materias', async () => {
      const carrera = createInstanceMock({ id: 1 });
      models.Carrera.findByPk.mockResolvedValue(carrera);
      models.Materia.count.mockResolvedValue(0);

      const result = await remove(1);

      expect(carrera.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia bloquear eliminacion si tiene materias', async () => {
      models.Carrera.findByPk.mockResolvedValue(createInstanceMock({ id: 1 }));
      models.Materia.count.mockResolvedValue(3);

      await expect(remove(1)).rejects.toThrow('No se puede eliminar una carrera que tiene materias asociadas');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Carrera.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Carrera no encontrada');
    });
  });
});
