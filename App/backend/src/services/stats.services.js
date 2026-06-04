import models from '../models/index.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getDashboardStats = handleDbErrors(async () => {
  const [carrerasCount, materiasCount, staffCount] = await Promise.all([
    models.Carrera.count({ where: { activa: true } }),
    models.CarreraMateria.count(),
    models.User.count({
      where: {
        rol: ['admin', 'profesor', 'tutor'],
        activo: true,
      },
    }),
  ]);

  return {
    carreras: carrerasCount,
    materias: materiasCount,
    staff: staffCount,
  };
});
