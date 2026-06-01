import { body, param } from 'express-validator';

export const createEventoValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
  body('fecha')
    .notEmpty()
    .isISO8601()
    .withMessage('Fecha es requerida y debe ser una fecha valida (YYYY-MM-DD)'),
  body('ubicacion')
    .optional()
    .trim(),
  body('estado')
    .optional()
    .isIn(['pendiente', 'confirmado', 'finalizado', 'cancelado'])
    .withMessage('Estado invalido (pendiente, confirmado, finalizado, cancelado)'),
];

export const updateEventoValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('Fecha debe ser una fecha valida (YYYY-MM-DD)'),
  body('ubicacion')
    .optional()
    .trim(),
  body('estado')
    .optional()
    .isIn(['pendiente', 'confirmado', 'finalizado', 'cancelado'])
    .withMessage('Estado invalido (pendiente, confirmado, finalizado, cancelado)'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID invalido'),
];
