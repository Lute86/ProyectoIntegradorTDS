import { jest } from '@jest/globals';

/**
 * Mock compartido de modelos Sequelize para unit tests de services.
 * Crea un mock autocontenido de cada modelo con los métodos más usados.
 */

export function createModelMock(overrides = {}) {
  const defaults = {
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    findOne: jest.fn().mockResolvedValue(null),
    findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
    create: jest.fn().mockImplementation((data) =>
      Promise.resolve({ id: 1, ...data, toJSON: () => ({ id: 1, ...data }) })
    ),
    count: jest.fn().mockResolvedValue(0),
    ...overrides,
  };
  return defaults;
}

export function createInstanceMock(data = {}) {
  const instance = {
    ...data,
    id: data.id ?? 1,
    update: jest.fn().mockImplementation(function (updates) {
      Object.assign(this, updates);
      return Promise.resolve(this);
    }),
    destroy: jest.fn().mockResolvedValue(true),
    toJSON: jest.fn().mockImplementation(function () {
      const { update, destroy, toJSON, ...rest } = this;
      return { ...rest };
    }),
  };
  return instance;
}

export const Op = {
  and: jest.fn((conds) => ({ [Op.and]: conds })),
  or: jest.fn((conds) => ({ [Op.or]: conds })),
  like: jest.fn((val) => ({ [Op.like]: val })),
  gte: jest.fn((val) => ({ [Op.gte]: val })),
  lte: jest.fn((val) => ({ [Op.lte]: val })),
  in: jest.fn((vals) => ({ [Op.in]: vals })),
  ne: jest.fn((val) => ({ [Op.ne]: val })),
};
