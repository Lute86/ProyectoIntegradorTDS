import { body, param } from 'express-validator';

export const createMateriaValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
];

export const updateMateriaValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
];
