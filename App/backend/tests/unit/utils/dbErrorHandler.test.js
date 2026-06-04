import { describe, it, expect } from '@jest/globals';
import { handleDbErrors } from '../../../src/utils/dbErrorHandler.js';
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../../src/utils/AppError.js';

function sequelizeError(name, fields = {}, errors = []) {
  const err = new Error(name);
  err.name = name;
  err.fields = fields;
  err.errors = errors;
  return err;
}

describe('handleDbErrors', () => {
  it('deberia retornar el resultado si la funcion no falla', async () => {
    const fn = handleDbErrors(async () => 'ok');
    const result = await fn();
    expect(result).toBe('ok');
  });

  it('deberia pasar argumentos a la funcion', async () => {
    const fn = handleDbErrors(async (a, b) => a + b);
    const result = await fn(2, 3);
    expect(result).toBe(5);
  });

  it('deberia re-lanzar AppError sin modificar', async () => {
    const original = new NotFoundError('custom msg');
    const fn = handleDbErrors(async () => {
      throw original;
    });

    await expect(fn()).rejects.toThrow('custom msg');
    await expect(fn()).rejects.toBeInstanceOf(NotFoundError);
  });

  it('deberia convertir SequelizeUniqueConstraintError a ConflictError (409)', async () => {
    const err = sequelizeError('SequelizeUniqueConstraintError', { email: 'email' });
    const fn = handleDbErrors(async () => {
      throw err;
    });

    try {
      await fn();
      expect(true).toBe(false); // no deberia llegar
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictError);
      expect(e.status).toBe(409);
      expect(e.message).toContain('email');
    }
  });

  it('deberia manejar SequelizeUniqueConstraintError sin fields', async () => {
    const err = sequelizeError('SequelizeUniqueConstraintError', {});
    const fn = handleDbErrors(async () => {
      throw err;
    });

    try {
      await fn();
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictError);
      expect(e.status).toBe(409);
      expect(e.message).toContain('campo');
    }
  });

  it('deberia convertir SequelizeValidationError a BadRequestError (400)', async () => {
    const err = sequelizeError('SequelizeValidationError', {}, [
      { message: 'email is invalid' },
      { message: 'nombre is required' },
    ]);
    const fn = handleDbErrors(async () => {
      throw err;
    });

    try {
      await fn();
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(e.status).toBe(400);
      expect(e.message).toContain('email is invalid');
      expect(e.message).toContain('nombre is required');
    }
  });

  it('deberia convertir SequelizeForeignKeyConstraintError a BadRequestError (400)', async () => {
    const err = sequelizeError('SequelizeForeignKeyConstraintError');
    const fn = handleDbErrors(async () => {
      throw err;
    });

    try {
      await fn();
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(e.status).toBe(400);
      expect(e.message).toBe('Referencia inválida');
    }
  });

  it('deberia convertir SequelizeEmptyResultError a NotFoundError (404)', async () => {
    const err = sequelizeError('SequelizeEmptyResultError');
    const fn = handleDbErrors(async () => {
      throw err;
    });

    try {
      await fn();
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
      expect(e.status).toBe(404);
    }
  });

  it('deberia re-lanzar errores desconocidos sin modificar', async () => {
    const original = new Error('random error');
    const fn = handleDbErrors(async () => {
      throw original;
    });

    await expect(fn()).rejects.toThrow('random error');
    await expect(fn()).rejects.not.toBeInstanceOf(AppError);
  });
});
