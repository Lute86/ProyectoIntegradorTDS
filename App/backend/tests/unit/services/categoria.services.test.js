import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { Categoria: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/categoria.services.js');

describe('categoria.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todas las categorías ordenadas', async () => {
      models.Categoria.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, nombre: 'Deportes' }),
        createInstanceMock({ id: 2, nombre: 'Tecnología' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(2);
      expect(models.Categoria.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['nombre', 'ASC']] })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la categoría por ID', async () => {
      models.Categoria.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Deportes' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Categoria.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Categoria no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una categoría con slug unico', async () => {
      models.Categoria.findOne.mockResolvedValue(null);
      models.Categoria.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Deportes', slug: 'deportes' })
      );

      const result = await create({ nombre: 'Deportes', slug: 'deportes' });

      expect(result.nombre).toBe('Deportes');
    });

    it('deberia lanzar error si el slug ya existe', async () => {
      models.Categoria.findOne.mockResolvedValue({ id: 1 });

      await expect(create({ slug: 'deportes' })).rejects.toThrow(
        'Ya existe una categoria con ese slug'
      );
    });
  });

  describe('update', () => {
    it('deberia actualizar una categoría existente', async () => {
      const categoria = createInstanceMock({ id: 1, slug: 'deportes' });
      models.Categoria.findByPk.mockResolvedValue(categoria);

      await update(1, { nombre: 'Nuevos Deportes' });

      expect(categoria.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Categoria.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Categoria no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una categoría existente', async () => {
      const categoria = createInstanceMock({ id: 1 });
      models.Categoria.findByPk.mockResolvedValue(categoria);

      const result = await remove(1);

      expect(categoria.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Categoria.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Categoria no encontrada');
    });
  });
});
