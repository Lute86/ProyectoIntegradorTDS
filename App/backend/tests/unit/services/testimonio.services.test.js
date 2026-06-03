import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { Testimonio: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/testimonio.services.js');

describe('testimonio.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todos los testimonios', async () => {
      models.Testimonio.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, autor_nombre: 'Maria' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
    });

    it('deberia filtrar por visible=true', async () => {
      models.Testimonio.findAll.mockResolvedValue([]);

      await getAll({ visible: true });

      expect(models.Testimonio.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { visible: true },
        })
      );
    });

    it('deberia filtrar por visible=false', async () => {
      models.Testimonio.findAll.mockResolvedValue([]);

      await getAll({ visible: false });

      expect(models.Testimonio.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { visible: false },
        })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar el testimonio por ID', async () => {
      models.Testimonio.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, autor_nombre: 'Maria' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Testimonio.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Testimonio no encontrado');
    });
  });

  describe('create', () => {
    it('deberia crear un testimonio', async () => {
      models.Testimonio.create.mockResolvedValue(
        createInstanceMock({ id: 1, autor_nombre: 'Maria', texto: 'Great' })
      );

      const result = await create({ autor_nombre: 'Maria', texto: 'Great' });

      expect(result.autor_nombre).toBe('Maria');
    });
  });

  describe('update', () => {
    it('deberia actualizar un testimonio existente', async () => {
      const testimonio = createInstanceMock({ id: 1 });
      models.Testimonio.findByPk.mockResolvedValue(testimonio);

      await update(1, { visible: false });

      expect(testimonio.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Testimonio.findByPk.mockResolvedValue(null);

      await expect(update(999, { visible: true })).rejects.toThrow('Testimonio no encontrado');
    });
  });

  describe('remove', () => {
    it('deberia eliminar un testimonio existente', async () => {
      const testimonio = createInstanceMock({ id: 1 });
      models.Testimonio.findByPk.mockResolvedValue(testimonio);

      const result = await remove(1);

      expect(testimonio.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminado');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Testimonio.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Testimonio no encontrado');
    });
  });
});
