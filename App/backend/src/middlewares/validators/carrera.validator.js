import { body, param } from 'express-validator';

export const createCarreraValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('slug')
    .notEmpty()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug inválido (solo minúsculas, números y guiones)'),
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Título debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
  body('duracion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duración debe ser un número positivo'),
  body('modalidad')
    .optional()
    .isIn(['presencial', 'virtual', 'hibrida'])
    .withMessage('Modalidad inválida'),
  body('icono')
    .optional()
    .trim(),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color debe ser un valor hexadecimal válido'),
  body('activa')
    .optional()
    .isBoolean()
    .withMessage('Activa debe ser un valor booleano'),
];

export const updateCarreraValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug inválido (solo minúsculas, números y guiones)'),
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Título debe tener al menos 2 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
  body('duracion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duración debe ser un número positivo'),
  body('modalidad')
    .optional()
    .isIn(['presencial', 'virtual', 'hibrida'])
    .withMessage('Modalidad inválida'),
  body('icono')
    .optional()
    .trim(),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color debe ser un valor hexadecimal válido'),
  body('activa')
    .optional()
    .isBoolean()
    .withMessage('Activa debe ser un valor booleano'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
];

export const slugParamValidation = [
  param('slug')
    .notEmpty()
    .trim()
    .withMessage('Slug requerido'),
];
