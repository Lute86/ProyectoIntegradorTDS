import { unauthorized, forbidden, validationError } from '../utils/response.js';

export function requireOwnerOrAdmin(paramIdField = 'id') {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'No autenticado');
    }

    const resourceId = parseInt(req.params[paramIdField], 10);

    if (isNaN(resourceId)) {
      return validationError(res, [{ msg: 'ID invalido', param: paramIdField }], 'ID invalido');
    }

    if (req.user.rol === 'admin') {
      return next();
    }

    if (req.user.id === resourceId) {
      return next();
    }

    return forbidden(res, 'Acceso denegado. Solo puedes acceder a tu propio perfil.');
  };
}
