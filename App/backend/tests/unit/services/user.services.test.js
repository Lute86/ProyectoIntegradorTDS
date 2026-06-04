import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn().mockResolvedValue('hashed-password'),
  },
}));

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { User: createModelMock() },
}));

const bcrypt = (await import('bcryptjs')).default;
const models = (await import('../../../src/models/index.js')).default;
const { getAll, getById, create, update, remove, toggleActive } = await import('../../../src/services/user.services.js');

describe('user.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deberia retornar todos los usuarios sin filtros', async () => {
      const users = [
        createInstanceMock({ id: 1, nombre: 'Admin', rol: 'admin' }),
        createInstanceMock({ id: 2, nombre: 'Profesor', rol: 'profesor' }),
      ];
      models.User.findAll.mockResolvedValue(users);

      const result = await getAll();

      expect(result).toHaveLength(2);
      expect(models.User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: expect.objectContaining({ exclude: ['password_hash'] }),
          order: [['nombre', 'ASC']],
        })
      );
    });

    it('deberia filtrar por rol', async () => {
      models.User.findAll.mockResolvedValue([]);

      await getAll({ rol: 'admin' });

      expect(models.User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { rol: 'admin' },
        })
      );
    });

    it('deberia filtrar por activo', async () => {
      models.User.findAll.mockResolvedValue([]);

      await getAll({ activo: 'true' });

      expect(models.User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { activo: true },
        })
      );
    });
  });

  describe('getById', () => {
    it('deberia retornar el usuario por ID', async () => {
      const user = createInstanceMock({ id: 1, nombre: 'Admin' });
      models.User.findByPk.mockResolvedValue(user);

      const result = await getById(1);

      expect(result.id).toBe(1);
    });

    it('deberia lanzar error si no existe', async () => {
      models.User.findByPk.mockResolvedValue(null);

      await expect(getById(999)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('create', () => {
    it('deberia crear un usuario hasheando el password', async () => {
      models.User.findOne.mockResolvedValue(null);
      models.User.create.mockResolvedValue(
        createInstanceMock({ id: 1, nombre: 'New', email: 'new@test.com', password_hash: 'hashed' })
      );

      const result = await create({
        nombre: 'New',
        email: 'new@test.com',
        password: '123456',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(result).not.toHaveProperty('password_hash');
    });

    it('deberia lanzar error si el email ya existe', async () => {
      models.User.findOne.mockResolvedValue({ id: 1 });

      await expect(
        create({ email: 'existing@test.com', password: '123456' })
      ).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('update', () => {
    it('deberia actualizar un usuario existente', async () => {
      const user = createInstanceMock({ id: 1, email: 'old@test.com' });
      models.User.findByPk.mockResolvedValue(user);

      const result = await update(1, { nombre: 'Updated' });

      expect(user.update).toHaveBeenCalledWith({ nombre: 'Updated' });
    });

    it('deberia hashear el password si se provee', async () => {
      const user = createInstanceMock({ id: 1, email: 'test@test.com' });
      models.User.findByPk.mockResolvedValue(user);

      await update(1, { password: 'newpass' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(user.update).toHaveBeenCalledWith(
        expect.objectContaining({ password_hash: 'hashed-password' })
      );
    });

    it('deberia lanzar error si no existe', async () => {
      models.User.findByPk.mockResolvedValue(null);

      await expect(update(999, { nombre: 'X' })).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('remove', () => {
    it('deberia eliminar un usuario existente', async () => {
      const user = createInstanceMock({ id: 1 });
      models.User.findByPk.mockResolvedValue(user);

      const result = await remove(1);

      expect(user.destroy).toHaveBeenCalled();
      expect(result.message).toContain('eliminado');
    });

    it('deberia lanzar error si no existe', async () => {
      models.User.findByPk.mockResolvedValue(null);

      await expect(remove(999)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('toggleActive', () => {
    it('deberia cambiar activo de true a false', async () => {
      const user = createInstanceMock({ id: 1, activo: true });
      models.User.findByPk.mockResolvedValue(user);

      const result = await toggleActive(1);

      expect(user.update).toHaveBeenCalledWith({ activo: false });
      expect(result).not.toHaveProperty('password_hash');
    });

    it('deberia cambiar activo de false a true', async () => {
      const user = createInstanceMock({ id: 1, activo: false });
      models.User.findByPk.mockResolvedValue(user);

      await toggleActive(1);

      expect(user.update).toHaveBeenCalledWith({ activo: true });
    });

    it('deberia lanzar error si no existe', async () => {
      models.User.findByPk.mockResolvedValue(null);

      await expect(toggleActive(999)).rejects.toThrow('Usuario no encontrado');
    });
  });
});
