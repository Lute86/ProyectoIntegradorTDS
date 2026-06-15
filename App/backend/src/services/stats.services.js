import models from '../models/index.js';
import { handleDbErrors } from '../utils/dbErrorHandler.js';

export const getRecentActivity = handleDbErrors(async () => {
  const limit = 3;

  const [noticias, eventos, consultas, testimonios, usuarios] = await Promise.all([
    models.Noticia.findAll({
      where: { estado: 'publicado' },
      order: [['fecha_publicacion', 'DESC NULLS LAST']],
      limit,
      attributes: ['id', 'titulo', 'fecha_publicacion'],
    }),
    models.Evento.findAll({
      order: [['fecha', 'ASC']],
      limit,
      attributes: ['id', 'nombre', 'fecha'],
    }),
    models.Consulta.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      attributes: ['id', 'asunto', 'nombre', 'createdAt', 'respondido'],
    }),
    models.Testimonio.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      attributes: ['id', 'autor_nombre', 'autor_carrera', 'createdAt'],
    }),
    models.User.findAll({
      order: [['ultimo_acceso', 'DESC NULLS LAST']],
      limit,
      where: { activo: true },
      attributes: ['id', 'nombre', 'apellido', 'ultimo_acceso', 'rol'],
    }),
  ]);

  const activities = [
    ...noticias.map((n) => ({
      tipo: 'noticia',
      texto: `Nueva noticia: ${n.titulo}`,
      timestamp: n.fecha_publicacion,
      id: n.id,
    })),
    ...eventos.map((e) => ({
      tipo: 'evento',
      texto: `Evento: ${e.nombre}`,
      timestamp: e.fecha,
      id: e.id,
    })),
    ...consultas.map((c) => ({
      tipo: 'consulta',
      texto: `Consulta de ${c.nombre}: ${c.asunto}`,
      timestamp: c.createdAt,
      id: c.id,
    })),
    ...testimonios.map((t) => ({
      tipo: 'testimonio',
      texto: `Testimonio de ${t.autor_nombre} (${t.autor_carrera})`,
      timestamp: t.createdAt,
      id: t.id,
    })),
    ...usuarios.map((u) => ({
      tipo: 'usuario',
      texto: `Último acceso: ${u.nombre} ${u.apellido} (${u.rol})`,
      timestamp: u.ultimo_acceso,
      id: u.id,
    })),
  ];

  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return activities.slice(0, 10);
});

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
