import { body, param } from 'express-validator';

export const createTestimonioValidation = [
  body('autor_nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre del autor es requerido y debe tener al menos 2 caracteres'),
  body('autor_carrera')
    .optional()
    .trim(),
  body('texto')
    .notEmpty()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Texto es requerido y debe tener al menos 10 caracteres'),
  body('visible')
    .optional()
    .isBoolean()
    .withMessage('Visible debe ser un valor booleano'),
];

export const updateTestimonioValidation = [
  body('autor_nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre del autor debe tener al menos 2 caracteres'),
  body('autor_carrera')
    .optional()
    .trim(),
  body('texto')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Texto debe tener al menos 10 caracteres'),
  body('visible')
    .optional()
    .isBoolean()
    .withMessage('Visible debe ser un valor booleano'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID invalido'),
];
