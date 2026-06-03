import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Noticia: createModelMock(),
    Categoria: createModelMock(),
    User: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, getBySlug, create, update, remove } = await import('../../../src/services/noticia.services.js');

describe('noticia.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar noticias con paginación', async () => {
      models.Noticia.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: [
          createInstanceMock({ id: 1, titulo: 'Noticia 1' }),
          createInstanceMock({ id: 2, titulo: 'Noticia 2' }),
        ],
      });

      const result = await getAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('deberia calcular totalPages correctamente', async () => {
      models.Noticia.findAndCountAll.mockResolvedValue({ count: 25, rows: [] });

      const result = await getAll({ page: 1, limit: 10 });

      expect(result.totalPages).toBe(3);
    });

    it('deberia filtrar por estado', async () => {
      models.Noticia.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getAll({ estado: 'publicado' });

      expect(models.Noticia.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ estado: 'publicado' }),
        })
      );
    });

    it('deberia filtrar por categoria_id', async () => {
      models.Noticia.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getAll({ categoria_id: 1 });

      expect(models.Noticia.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoria_id: 1 }),
        })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la noticia con categoria y autor', async () => {
      models.Noticia.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, titulo: 'Test' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
      expect(models.Noticia.findByPk).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({ as: 'categoria' }),
            expect.objectContaining({ as: 'autor' }),
          ]),
        })
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.Noticia.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Noticia no encontrada');
    });
  });

  describe('getBySlug', () => {
    it('deberia retornar la noticia por slug', async () => {
      models.Noticia.findOne.mockResolvedValue(
        createInstanceMock({ id: 1, slug: 'mi-noticia' })
      );

      const result = await getBySlug('mi-noticia');

      expect(result.slug).toBe('mi-noticia');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Noticia.findOne.mockResolvedValue(null);

      await expect(getBySlug('no-existe')).rejects.toThrow('Noticia no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una noticia con slug unico', async () => {
      models.Noticia.findOne.mockResolvedValue(null);
      models.Noticia.create.mockResolvedValue(
        createInstanceMock({ id: 1, slug: 'mi-noticia' })
      );
      // Mock para getById que se llama al final
      models.Noticia.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, slug: 'mi-noticia', titulo: 'Test' })
      );

      const result = await create({ titulo: 'Test', slug: 'mi-noticia' });

      expect(result.slug).toBe('mi-noticia');
    });

    it('deberia lanzar error si el slug ya existe', async () => {
      models.Noticia.findOne.mockResolvedValue({ id: 1 });

      await expect(create({ slug: 'duplicado' })).rejects.toThrow(
        'Ya existe una noticia con ese slug'
      );
    });

    it('deberia validar categoria_id si se provee', async () => {
      models.Noticia.findOne.mockResolvedValue(null);
      models.Categoria.findByPk.mockResolvedValue(null);

      await expect(
        create({ slug: 'test', categoria_id: 999 }
      )).rejects.toThrow('La categoria especificada no existe');
    });

    it('deberia validar autor_id si se provee', async () => {
      models.Noticia.findOne.mockResolvedValue(null);
      models.Categoria.findByPk.mockResolvedValue(null);
      models.User.findByPk.mockResolvedValue(null);

      await expect(
        create({ slug: 'test', autor_id: 999 }
      )).rejects.toThrow('El autor especificado no existe');
    });
  });

  describe('update', () => {
    it('deberia actualizar una noticia existente', async () => {
      const noticia = createInstanceMock({ id: 1, slug: 'old-slug', categoria_id: 1, autor_id: 1 });
      models.Noticia.findByPk.mockResolvedValue(noticia);
      // Mock para getById
      models.Noticia.findByPk
        .mockResolvedValueOnce(noticia)
        .mockResolvedValueOnce(createInstanceMock({ id: 1, slug: 'new-slug' }));

      await update(1, { slug: 'new-slug' });

      expect(noticia.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Noticia.findByPk.mockResolvedValue(null);

      await expect(update(999, { titulo: 'X' })).rejects.toThrow('Noticia no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una noticia existente', async () => {
      const noticia = createInstanceMock({ id: 1 });
      models.Noticia.findByPk.mockResolvedValue(noticia);

      const result = await remove(1);

      expect(noticia.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Noticia.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Noticia no encontrada');
    });
  });
});
