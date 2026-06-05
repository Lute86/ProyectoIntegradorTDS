import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createModelMock } from '../mocks/models.js';

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: {
    Carrera: createModelMock(),
    CarreraMateria: createModelMock(),
    User: createModelMock(),
  },
}));

const models = (await import('../../../src/models/index.js')).default;
const { getDashboardStats } = await import('../../../src/services/stats.services.js');

describe('stats.services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('deberia retornar conteos de carreras, materias y staff', async () => {
      models.Carrera.count.mockResolvedValue(5);
      models.CarreraMateria.count.mockResolvedValue(20);
      models.User.count.mockResolvedValue(10);

      const result = await getDashboardStats();

      expect(result.carreras).toBe(5);
      expect(result.materias).toBe(20);
      expect(result.staff).toBe(10);
    });

    it('deberia contar solo carreras activas', async () => {
      models.Carrera.count.mockResolvedValue(3);
      models.CarreraMateria.count.mockResolvedValue(0);
      models.User.count.mockResolvedValue(0);

      await getDashboardStats();

      expect(models.Carrera.count).toHaveBeenCalledWith({
        where: { activa: true },
      });
    });

    it('deberia contar solo staff activo', async () => {
      models.Carrera.count.mockResolvedValue(0);
      models.CarreraMateria.count.mockResolvedValue(0);
      models.User.count.mockResolvedValue(5);

      await getDashboardStats();

      expect(models.User.count).toHaveBeenCalledWith({
        where: {
          rol: ['admin', 'profesor', 'tutor'],
          activo: true,
        },
      });
    });

    it('deberia retornar 0 cuando no hay datos', async () => {
      models.Carrera.count.mockResolvedValue(0);
      models.CarreraMateria.count.mockResolvedValue(0);
      models.User.count.mockResolvedValue(0);

      const result = await getDashboardStats();

      expect(result.carreras).toBe(0);
      expect(result.materias).toBe(0);
      expect(result.staff).toBe(0);
    });
  });
});
