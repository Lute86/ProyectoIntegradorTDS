import multer from 'multer';
import logger from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'El archivo excede el tamaño máximo permitido (5MB)',
      LIMIT_FILE_COUNT: 'Demasiados archivos',
      LIMIT_UNEXPECTED_FILE: 'Campo de archivo inesperado',
    };

    logger.error('Error de multer:', { message: err.message, code: err.code });

    return res.status(400).json({
      success: false,
      message: messages[err.code] || 'Error al subir el archivo',
      errors: [{ msg: err.message, param: err.field }],
    });
  }

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
