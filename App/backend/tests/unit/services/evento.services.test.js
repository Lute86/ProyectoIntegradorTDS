import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { Evento: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/evento.services.js');

describe('evento.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todos los eventos', async () => {
      models.Evento.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, nombre: 'Charla' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
    });

    it('deberia filtrar por estado', async () => {
      models.Evento.findAll.mockResolvedValue([]);

      await getAll({ estado: 'confirmado' });

      expect(models.Evento.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ estado: 'confirmado' }),
        })
      );
    });

    it('deberia filtrar por fecha_desde', async () => {
      models.Evento.findAll.mockResolvedValue([]);

      await getAll({ fecha_desde: '2026-01-01' });

      const call = models.Evento.findAll.mock.calls[0][0];
      expect(call.where.fecha).toBeDefined();
      const symbolKeys = Object.getOwnPropertySymbols(call.where.fecha);
      expect(symbolKeys.length).toBeGreaterThan(0);
    });

    it('deberia filtrar por fecha_hasta', async () => {
      models.Evento.findAll.mockResolvedValue([]);

      await getAll({ fecha_hasta: '2026-12-31' });

      expect(models.Evento.findAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('deberia retornar el evento por ID', async () => {
      models.Evento.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Charla' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Evento.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('create', () => {
    it('deberia crear un evento', async () => {
      models.Evento.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'Charla', fecha: '2026-07-15' })
      );

      const result = await create({ nombre: 'Charla', fecha: '2026-07-15' });

      expect(result.nombre).toBe('Charla');
    });
  });

  describe('update', () => {
    it('deberia actualizar un evento existente', async () => {
      const evento = createInstanceMock({ id: 1, nombre: 'Old' });
      models.Evento.findByPk.mockResolvedValue(evento);

      await update(1, { nombre: 'New' });

      expect(evento.update).toHaveBeenCalled();
    });

    it('deberia verificar nombre unico si cambia', async () => {
      const evento = createInstanceMock({ id: 1, nombre: 'Old' });
      models.Evento.findByPk.mockResolvedValue(evento);
      models.Evento.findOne.mockResolvedValue({ id: 2 });

      await expect(update(1, { nombre: 'Duplicate' })).rejects.toThrow(
        'Ya existe un evento con ese nombre'
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.Evento.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Evento no encontrado');
    });
  });

  describe('remove', () => {
    it('deberia eliminar un evento existente', async () => {
      const evento = createInstanceMock({ id: 1 });
      models.Evento.findByPk.mockResolvedValue(evento);

      const result = await remove(1);

      expect(evento.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminado');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Evento.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Evento no encontrado');
    });
  });
});
