import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { Imagen: createModelMock() },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove } = await import('../../../src/services/imagen.services.js');

describe('imagen.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todas las imágenes', async () => {
      models.Imagen.findAll.mockResolvedValue([
        createInstanceMock({ id: 1, titulo: 'Foto' }),
      ]);

      const result = await getAll();

      expect(result).toHaveLength(1);
    });

    it('deberia filtrar por categoría', async () => {
      models.Imagen.findAll.mockResolvedValue([]);

      await getAll({ categoria: 'carrera' });

      expect(models.Imagen.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoria: 'carrera' },
        })
      );
    });

    it('deberia filtrar por entidad_id', async () => {
      models.Imagen.findAll.mockResolvedValue([]);

      await getAll({ entidad_id: 1 });

      expect(models.Imagen.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { entidad_id: 1 },
        })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar la imagen por ID', async () => {
      models.Imagen.findByPk.mockResolvedValue(
        createInstanceMock({ id: 1, titulo: 'Foto' })
      );

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.Imagen.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Imagen no encontrada');
    });
  });

  describe('create', () => {
    it('deberia crear una imagen', async () => {
      models.Imagen.create.mockResolvedValue(
        createInstanceMock({ id: 1, titulo: 'Foto', url: '/uploads/foto.jpg' })
      );

      const result = await create({ titulo: 'Foto', url: '/uploads/foto.jpg' });

      expect(result.titulo).toBe('Foto');
    });
  });

  describe('update', () => {
    it('deberia actualizar una imagen existente', async () => {
      const imagen = createInstanceMock({ id: 1, url: '/uploads/old.jpg' });
      models.Imagen.findByPk.mockResolvedValue(imagen);

      await update(1, { titulo: 'Updated' });

      expect(imagen.update).toHaveBeenCalled();
    });

    it('deberia verificar URL unica si cambia', async () => {
      const imagen = createInstanceMock({ id: 1, url: '/uploads/old.jpg' });
      models.Imagen.findByPk.mockResolvedValue(imagen);
      models.Imagen.findOne.mockResolvedValue({ id: 2, url: '/uploads/new.jpg' });

      await expect(update(1, { url: '/uploads/new.jpg' })).rejects.toThrow(
        'Ya existe una imagen con esa URL'
      );
    });

    it('deberia permitir actualizar con la misma URL', async () => {
      const imagen = createInstanceMock({ id: 1, url: '/uploads/same.jpg' });
      models.Imagen.findByPk.mockResolvedValue(imagen);
      models.Imagen.findOne.mockResolvedValue({ id: 1, url: '/uploads/same.jpg' });

      await update(1, { titulo: 'Updated' });

      expect(imagen.update).toHaveBeenCalled();
    });

    it('deberia lanzar error si no existe', async () => {
      models.Imagen.findByPk.mockResolvedValue(null);

      await expect(update(999, { titulo: 'X' })).rejects.toThrow('Imagen no encontrada');
    });
  });

  describe('remove', () => {
    it('deberia eliminar una imagen existente', async () => {
      const imagen = createInstanceMock({ id: 1 });
      models.Imagen.findByPk.mockResolvedValue(imagen);

      const result = await remove(1);

      expect(imagen.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminada');
    });

    it('deberia lanzar error si no existe', async () => {
      models.Imagen.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Imagen no encontrada');
    });
  });
});
