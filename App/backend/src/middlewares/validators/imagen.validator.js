import { body, param } from 'express-validator';

export const createImagenValidation = [
  body('titulo')
    .optional()
    .trim(),
  body('url')
    .optional()
    .trim(),
  body('alt_text')
    .optional()
    .trim(),
  body('categoria')
    .optional()
    .trim(),
  body('entidad_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('entidad_id debe ser un entero valido'),
];

export const updateImagenValidation = [
  body('titulo')
    .optional()
    .trim(),
  body('url')
    .optional()
    .trim(),
  body('alt_text')
    .optional()
    .trim(),
  body('categoria')
    .optional()
    .trim(),
  body('entidad_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('entidad_id debe ser un entero valido'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID invalido'),
];
