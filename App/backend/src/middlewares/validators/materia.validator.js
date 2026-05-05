import { body, param } from 'express-validator';

export const createMateriaValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('carrera_id')
    .isInt({ min: 1 })
    .withMessage('carrera_id debe ser un entero válido'),
  body('cuatrimestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Cuatrimestre debe ser un número entre 1 y 12'),
  body('carga_horaria_semanal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Carga horaria debe ser un número positivo'),
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
  body('carrera_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('carrera_id debe ser un entero válido'),
  body('cuatrimestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Cuatrimestre debe ser un número entre 1 y 12'),
  body('carga_horaria_semanal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Carga horaria debe ser un número positivo'),
  body('descripcion')
    .optional()
    .trim(),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
];
