import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Error capturado por errorHandler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  const response = {
    success: false,
    message,
  };

  // Solo incluir stack en desarrollo
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}
