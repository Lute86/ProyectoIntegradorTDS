import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn().mockReturnValue('fake-jwt-token'),
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { User: createModelMock() },
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const bcrypt = (await import('bcryptjs')).default;
const jwt = (await import('jsonwebtoken')).default;
const models = (await import('../../../src/models/index.js')).default;
const { login, refreshToken, hashPassword } = await import('../../../src/services/auth.services.js');

describe('auth.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deberia retornar token y usuario con credenciales validas', async () => {
      const mockUser = createInstanceMock({
        id: 1,
        email: 'test@test.com',
        password_hash: 'hashed-password',
        rol: 'admin',
        activo: true,
        nombre: 'Test',
        apellido: 'User',
        avatar_url: null,
      });

      models.User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await login('test@test.com', '123456');

      expect(result.token).toBe('fake-jwt-token');
      expect(result.user.email).toBe('test@test.com');
      expect(mockUser.update).toHaveBeenCalledWith(
        expect.objectContaining({ ultimo_acceso: expect.any(Date) })
      );
    });

    it('deberia lanzar error si el usuario no existe', async () => {
      models.User.findOne.mockResolvedValue(null);

      await expect(login('no@test.com', '123456')).rejects.toThrow('Usuario no encontrado');
    });

    it('deberia lanzar error si el usuario esta inactivo', async () => {
      models.User.findOne.mockResolvedValue(
        createInstanceMock({ email: 'test@test.com', activo: false })
      );

      await expect(login('test@test.com', '123456')).rejects.toThrow('Usuario inactivo');
    });

    it('deberia lanzar error si la contraseña es incorrecta', async () => {
      models.User.findOne.mockResolvedValue(
        createInstanceMock({ email: 'test@test.com', password_hash: 'hashed', activo: true })
      );
      bcrypt.compare.mockResolvedValue(false);

      await expect(login('test@test.com', 'wrong')).rejects.toThrow('Contraseña incorrecta');
    });
  });

  describe('refreshToken', () => {
    it('deberia retornar un nuevo token', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'test@test.com', rol: 'admin' });
      models.User.findByPk.mockResolvedValue(
        createInstanceMock({
          id: 1,
          email: 'test@test.com',
          rol: 'admin',
          activo: true,
          nombre: 'Test',
          apellido: 'User',
          avatar_url: null,
        })
      );

      const result = await refreshToken('old-token');

      expect(result.token).toBe('fake-jwt-token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('deberia lanzar error si el token es invalido', async () => {
      jwt.verify.mockImplementation(() => {
        throw { name: 'JsonWebTokenError' };
      });

      await expect(refreshToken('bad-token')).rejects.toThrow('Token inválido o expirado');
    });

    it('deberia lanzar error si el usuario no existe o esta inactivo', async () => {
      jwt.verify.mockReturnValue({ id: 999 });
      models.User.findByPk.mockResolvedValue(null);

      await expect(refreshToken('token')).rejects.toThrow('Usuario no válido');
    });
  });

  describe('hashPassword', () => {
    it('deberia retornar el hash de la contraseña', async () => {
      const hash = await hashPassword('mypassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('mypassword', 10);
      expect(hash).toBe('hashed-password');
    });
  });
});
