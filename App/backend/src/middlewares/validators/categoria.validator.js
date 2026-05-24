import { body, param } from 'express-validator';

export const createCategoriaValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('slug')
    .notEmpty()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug invalido (solo minusculas, numeros y guiones)'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color debe ser un valor hexadecimal valido'),
];

export const updateCategoriaValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug invalido (solo minusculas, numeros y guiones)'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color debe ser un valor hexadecimal valido'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID invalido'),
];
