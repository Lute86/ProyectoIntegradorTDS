import { unauthorized, forbidden } from '../utils/response.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'No autenticado');
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return forbidden(res, 'Acceso denegado. Rol insuficiente.');
    }

    next();
  };
}
