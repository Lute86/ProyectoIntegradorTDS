import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { Consulta: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove, getUnreadCount } = await import('../../../src/services/consulta.services.js');

describe('consulta.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar consultas con paginación', async () => {
      models.Consulta.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [createInstanceMock({ id: 1, nombre: 'Juan' })],
      });

      const result = await getAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('deberia filtrar por respondido', async () => {
      models.Consulta.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getAll({ respondido: 'true' });

      expect(models.Consulta.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ respondido: true }),
        })
      );
    });

    it('deberia buscar por nombre/email/asunto', async () => {
      models.Consulta.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await getAll({ search: 'juan' });

      expect(models.Consulta.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('deberia retornar la consulta por ID', async () => {
      models.Consulta.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Juan' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Consulta.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Consulta no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una consulta', async () => {
      models.Consulta.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Juan', email: 'juan@test.com' })
      );

      const result = await create({
        nombre: 'Juan',
        email: 'juan@test.com',
        asunto: 'Consulta',
        mensaje: 'Hola',
      });

      expect(result.nombre).toBe('Juan');
    });
  });

  describe('update', () => {
    it('deberia actualizar una consulta existente', async () => {
      const consulta = createInstanceMock({ id: 1 });
      models.Consulta.findByPk.mockResolvedValue(consulta);

      await update(1, { respondido: true, respuesta: 'Gracias por contactarnos' });

      expect(consulta.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Consulta.findByPk.mockResolvedValue(null);

      await expect(update(999, { respondido: true })).rejects.toThrow('Consulta no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una consulta existente', async () => {
      const consulta = createInstanceMock({ id: 1 });
      models.Consulta.findByPk.mockResolvedValue(consulta);

      const result = await remove(1);

      expect(consulta.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Consulta.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Consulta no encontrada');
    });
  });

  describe('getUnreadCount', () => {
    it('deberia retornar el conteo de consultas sin leer', async () => {
      models.Consulta.count.mockResolvedValue(5);

      const result = await getUnreadCount();

      expect(result.count).toBe(5);
      expect(models.Consulta.count).toHaveBeenCalledWith({
        where: { respondido: false },
      });
    });

    it('deberia retornar 0 si no hay consultas sin leer', async () => {
      models.Consulta.count.mockResolvedValue(0);

      const result = await getUnreadCount();

      expect(result.count).toBe(0);
    });
  });
});
