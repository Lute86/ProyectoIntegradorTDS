import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  },
}));

const jwt = (await import('jsonwebtoken')).default;
const { generateToken, verifyToken, decodeToken } = await import('../../../src/utils/token.js');

describe('token utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('deberia llamar jwt.sign con payload y secret', () => {
      jwt.sign.mockReturnValue('fake-token');
      const payload = { id: 1, email: 'test@test.com', rol: 'admin' };

      const token = generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(token).toBe('fake-token');
    });

    it('deberia usar expiresIn custom', () => {
      jwt.sign.mockReturnValue('token');
      generateToken({ id: 1 }, '24h');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        expect.any(String),
        { expiresIn: '24h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('deberia retornar el payload decodificado', () => {
      const payload = { id: 1, email: 'test@test.com' };
      jwt.verify.mockReturnValue(payload);

      const result = verifyToken('valid-token');

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
      expect(result).toEqual(payload);
    });

    it('deberia lanzar error si el token es invalido', () => {
      jwt.verify.mockImplementation(() => {
        throw { name: 'JsonWebTokenError' };
      });

      expect(() => verifyToken('bad-token')).toThrow('Token inválido o expirado');
    });

    it('deberia lanzar error si el token expiro', () => {
      jwt.verify.mockImplementation(() => {
        throw { name: 'TokenExpiredError' };
      });

      expect(() => verifyToken('expired-token')).toThrow('Token inválido o expirado');
    });
  });

  describe('decodeToken', () => {
    it('deberia retornar el payload decodificado', () => {
      const payload = { id: 1 };
      jwt.decode.mockReturnValue(payload);

      const result = decodeToken('some-token');

      expect(jwt.decode).toHaveBeenCalledWith('some-token');
      expect(result).toEqual(payload);
    });

    it('deberia retornar null si el token es invalido', () => {
      jwt.decode.mockReturnValue(null);

      const result = decodeToken('invalid');

      expect(result).toBeNull();
    });
  });
});
