import { describe, it, expect, jest } from '@jest/globals';
import {
  success,
  created,
  deleted,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  validationError,
  tooManyRequests,
  serverError,
} from '../../../src/utils/response.js';

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('success', () => {
  it('deberia retornar 200 con data y message por defecto', () => {
    const res = mockRes();
    const data = { id: 1, nombre: 'test' };

    success(res, data);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operación exitosa',
      data,
    });
  });

  it('deberia aceptar message custom', () => {
    const res = mockRes();
    success(res, null, 'Custom message');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Custom message',
      data: null,
    });
  });

  it('deberia aceptar status custom', () => {
    const res = mockRes();
    success(res, { ok: true }, 'Ok', 202);
    expect(res.status).toHaveBeenCalledWith(202);
  });
});

describe('created', () => {
  it('deberia retornar 201', () => {
    const res = mockRes();
    created(res, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recurso creado exitosamente',
      data: { id: 1 },
    });
  });
});

describe('deleted', () => {
  it('deberia retornar 200 con null data', () => {
    const res = mockRes();
    deleted(res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recurso eliminado exitosamente',
      data: null,
    });
  });
});

describe('noContent', () => {
  it('deberia retornar 204 sin body', () => {
    const res = mockRes();
    noContent(res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('badRequest', () => {
  it('deberia retornar 400 sin errors', () => {
    const res = mockRes();
    badRequest(res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Solicitud inválida',
    });
  });

  it('deberia incluir errors cuando se provee', () => {
    const res = mockRes();
    const errors = [{ msg: 'required' }];
    badRequest(res, 'Invalid', errors);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid',
      errors,
    });
  });

  it('deberia excluir errors cuando es null', () => {
    const res = mockRes();
    badRequest(res, 'Invalid', null);
    const call = res.json.mock.calls[0][0];
    expect(call).not.toHaveProperty('errors');
  });
});

describe('unauthorized', () => {
  it('deberia retornar 401', () => {
    const res = mockRes();
    unauthorized(res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'No autorizado',
    });
  });
});

describe('forbidden', () => {
  it('deberia retornar 403', () => {
    const res = mockRes();
    forbidden(res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Acceso denegado',
    });
  });
});

describe('notFound', () => {
  it('deberia retornar 404', () => {
    const res = mockRes();
    notFound(res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Recurso no encontrado',
    });
  });
});

describe('conflict', () => {
  it('deberia retornar 409', () => {
    const res = mockRes();
    conflict(res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'El recurso ya existe',
    });
  });
});

describe('validationError', () => {
  it('deberia retornar 400 con errors', () => {
    const res = mockRes();
    const errors = [{ msg: 'email invalid' }];
    validationError(res, errors);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error de validación',
      errors,
    });
  });
});

describe('tooManyRequests', () => {
  it('deberia retornar 429', () => {
    const res = mockRes();
    tooManyRequests(res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Demasiadas solicitudes, intente más tarde',
    });
  });
});

describe('serverError', () => {
  it('deberia retornar 500', () => {
    const res = mockRes();
    serverError(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error interno del servidor',
    });
  });
});
