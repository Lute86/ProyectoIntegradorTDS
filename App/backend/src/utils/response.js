/**
 * Utilidades de respuesta HTTP estandarizadas
 * Formato consistente: { success: boolean, message?: string, data?: any, errors?: any }
 */

// Respuestas exitosas (2xx)
export function success(res, data = null, message = 'Operación exitosa', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function created(res, data = null, message = 'Recurso creado exitosamente') {
  return success(res, data, message, 201);
}

export function noContent(res) {
  return res.status(204).send();
}

// Respuestas de error cliente (4xx)
export function badRequest(res, message = 'Solicitud inválida', errors = null) {
  return res.status(400).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}

export function unauthorized(res, message = 'No autorizado') {
  return res.status(401).json({
    success: false,
    message,
  });
}

export function forbidden(res, message = 'Acceso denegado') {
  return res.status(403).json({
    success: false,
    message,
  });
}

export function notFound(res, message = 'Recurso no encontrado') {
  return res.status(404).json({
    success: false,
    message,
  });
}

export function conflict(res, message = 'El recurso ya existe') {
  return res.status(409).json({
    success: false,
    message,
  });
}

export function validationError(res, errors, message = 'Error de validación') {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
}

export function tooManyRequests(res, message = 'Demasiadas solicitudes, intente más tarde') {
  return res.status(429).json({
    success: false,
    message,
  });
}

// Respuestas de error servidor (5xx)
export function serverError(res, message = 'Error interno del servidor') {
  return res.status(500).json({
    success: false,
    message,
  });
}

// Exportación por defecto para uso como clase estática (compatibilidad)
export default {
  success,
  created,
  noContent,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  validationError,
  tooManyRequests,
  serverError,
};
