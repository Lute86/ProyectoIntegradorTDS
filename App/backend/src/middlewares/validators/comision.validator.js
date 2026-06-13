import { body, param } from 'express-validator';

export const createComisionValidation = [
  body('carrera_materia_id')
    .isInt({ min: 1 })
    .withMessage('carrera_materia_id debe ser un entero válido'),
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Nombre es requerido y debe tener entre 1 y 20 caracteres'),
  body('anio_lectivo')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Año lectivo debe ser un entero válido entre 2020 y 2030'),
  body('semestre')
    .isInt({ min: 1, max: 2 })
    .withMessage('Semestre debe ser 1 o 2'),
  body('encargado_id')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('encargado_id debe ser un entero válido'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),
];

export const updateComisionValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
  body('carrera_materia_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('carrera_materia_id debe ser un entero válido'),
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Nombre debe tener entre 1 y 20 caracteres'),
  body('anio_lectivo')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Año lectivo debe ser un entero válido entre 2020 y 2030'),
  body('semestre')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('Semestre debe ser 1 o 2'),
  body('encargado_id')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('encargado_id debe ser un entero válido'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
];
