import models from '../models/index.js';
import { unauthorized, forbidden, notFound } from '../utils/response.js';

export function requireNoticiaOwnership() {
  return async (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'No autenticado');
    }

    const noticiaId = parseInt(req.params.id, 10);

    if (isNaN(noticiaId)) {
      return forbidden(res, 'ID de noticia inválido');
    }

    if (req.user.rol === 'admin') {
      return next();
    }

    const noticia = await models.Noticia.findByPk(noticiaId);

    if (!noticia) {
      return notFound(res, 'Noticia no encontrada');
    }

    if (['profesor', 'tutor'].includes(req.user.rol) && noticia.autor_id === req.user.id) {
      return next();
    }

    return forbidden(res, 'Solo puedes modificar tus propias noticias');
  };
}
