import { describe, it, expect, jest } from '@jest/globals';
import { asyncHandler } from '../../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  it('deberia ejecutar la funcion y retornar su resultado', async () => {
    const fn = jest.fn().mockResolvedValue('resultado');
    const handler = asyncHandler(fn);

    const req = {};
    const res = {};
    const next = jest.fn();

    const result = await handler(req, res, next);

    expect(result).toBe('resultado');
    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('deberia llamar next(error) si la funcion rechaza', async () => {
    const error = new Error('fallo');
    const fn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(fn);

    const req = {};
    const res = {};
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('deberia pasar req, res, next a la funcion', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    const req = { method: 'GET', path: '/test' };
    const res = { status: jest.fn() };
    const next = jest.fn();

    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });
});
