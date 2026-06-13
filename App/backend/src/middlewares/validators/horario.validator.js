import { body, param } from 'express-validator';

const DIAS_VALIDOS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

export const createHorarioValidation = [
  body('carrera_materia_id')
    .isInt({ min: 1 })
    .withMessage('carrera_materia_id debe ser un entero válido'),
  body('comision_id')
    .isInt({ min: 1 })
    .withMessage('comision_id debe ser un entero válido'),
  body('dia')
    .notEmpty()
    .trim()
    .isIn(DIAS_VALIDOS)
    .withMessage(`Dia debe ser uno de: ${DIAS_VALIDOS.join(', ')}`),
  body('horario')
    .notEmpty()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Horario es requerido y debe tener al menos 5 caracteres'),
  body('aula')
    .notEmpty()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Aula es requerida'),
  body('profesor')
    .optional()
    .trim(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),
];

export const updateHorarioValidation = [
  body('carrera_materia_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('carrera_materia_id debe ser un entero válido'),
  body('comision_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('comision_id debe ser un entero válido'),
  body('dia')
    .optional()
    .trim()
    .isIn(DIAS_VALIDOS)
    .withMessage(`Dia debe ser uno de: ${DIAS_VALIDOS.join(', ')}`),
  body('horario')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Horario debe tener al menos 5 caracteres'),
  body('aula')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Aula es requerida'),
  body('profesor')
    .optional()
    .trim(),
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
