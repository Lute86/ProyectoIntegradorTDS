import { AppError, BadRequestError, ConflictError, NotFoundError } from './AppError.js';

/**
 * Wrapper para funciones que realizan operaciones de base de datos.
 * Convierte errores de Sequelize a AppErrors apropiados automáticamente.
 * Uso: export const login = handleDbErrors(async (email, password) => { ... });
 */
export const handleDbErrors = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    // Si ya es un AppError, re-lanzarlo tal cual
    if (error instanceof AppError) {
      throw error;
    }

    // Error de constraint único (ej. email duplicado)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = Object.keys(error.fields || {})[0] || 'campo';
      throw new ConflictError(`El ${field} ya está registrado`);
    }

    // Error de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      throw new BadRequestError(`Datos inválidos: ${messages.join(', ')}`);
    }

    // Error de clave foránea
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new BadRequestError('Referencia inválida');
    }

    // Error de registro no encontrado
    if (error.name === 'SequelizeEmptyResultError') {
      throw new NotFoundError('Recurso no encontrado');
    }

    // Para otros errores, re-lanzar para que los maneje errorHandler
    throw error;
  }
};
