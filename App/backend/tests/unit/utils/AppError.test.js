import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../../../src/utils/AppError.js';

describe('AppError', () => {
  it('deberia crear un error con status custom', () => {
    const error = new AppError('Test error', 418);
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(418);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('deberia usar status 500 por defecto', () => {
    const error = new AppError('Test');
    expect(error.status).toBe(500);
  });

  it('deberia tener stack trace', () => {
    const error = new AppError('Test');
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});

describe('BadRequestError', () => {
  it('deberia tener status 400 y mensaje por defecto', () => {
    const error = new BadRequestError();
    expect(error.status).toBe(400);
    expect(error.message).toBe('Solicitud inválida');
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it('deberia aceptar mensaje custom', () => {
    const error = new BadRequestError('Campo requerido');
    expect(error.message).toBe('Campo requerido');
    expect(error.status).toBe(400);
  });
});

describe('UnauthorizedError', () => {
  it('deberia tener status 401 y mensaje por defecto', () => {
    const error = new UnauthorizedError();
    expect(error.status).toBe(401);
    expect(error.message).toBe('No autorizado');
    expect(error).toBeInstanceOf(AppError);
  });

  it('deberia aceptar mensaje custom', () => {
    const error = new UnauthorizedError('Token expirado');
    expect(error.message).toBe('Token expirado');
  });
});

describe('ForbiddenError', () => {
  it('deberia tener status 403 y mensaje por defecto', () => {
    const error = new ForbiddenError();
    expect(error.status).toBe(403);
    expect(error.message).toBe('Acceso denegado');
    expect(error).toBeInstanceOf(AppError);
  });

  it('deberia aceptar mensaje custom', () => {
    const error = new ForbiddenError('Solo admin');
    expect(error.message).toBe('Solo admin');
  });
});

describe('NotFoundError', () => {
  it('deberia tener status 404 y mensaje por defecto', () => {
    const error = new NotFoundError();
    expect(error.status).toBe(404);
    expect(error.message).toBe('Recurso no encontrado');
    expect(error).toBeInstanceOf(AppError);
  });

  it('deberia aceptar mensaje custom', () => {
    const error = new NotFoundError('Usuario no encontrado');
    expect(error.message).toBe('Usuario no encontrado');
  });
});

describe('ConflictError', () => {
  it('deberia tener status 409 y mensaje por defecto', () => {
    const error = new ConflictError();
    expect(error.status).toBe(409);
    expect(error.message).toBe('El recurso ya existe');
    expect(error).toBeInstanceOf(AppError);
  });

  it('deberia aceptar mensaje custom', () => {
    const error = new ConflictError('Email duplicado');
    expect(error.message).toBe('Email duplicado');
  });
});

describe('Jerarquia de herencia', () => {
  it('todas las subclases deben ser instanceof AppError', () => {
    expect(new BadRequestError()).toBeInstanceOf(AppError);
    expect(new UnauthorizedError()).toBeInstanceOf(AppError);
    expect(new ForbiddenError()).toBeInstanceOf(AppError);
    expect(new NotFoundError()).toBeInstanceOf(AppError);
    expect(new ConflictError()).toBeInstanceOf(AppError);
  });

  it('todas las subclases deben ser instanceof Error', () => {
    expect(new BadRequestError()).toBeInstanceOf(Error);
    expect(new UnauthorizedError()).toBeInstanceOf(Error);
    expect(new ForbiddenError()).toBeInstanceOf(Error);
    expect(new NotFoundError()).toBeInstanceOf(Error);
    expect(new ConflictError()).toBeInstanceOf(Error);
  });
});
