import { body, param } from 'express-validator';

export const createCarreraMateriaValidation = [
  param('carreraId')
    .isInt({ min: 1 })
    .withMessage('ID de carrera inválido'),
  body('materia_id')
    .isInt({ min: 1 })
    .withMessage('materia_id debe ser un entero válido'),
  body('cuatrimestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Cuatrimestre debe ser un número entre 1 y 12'),
  body('carga_horaria_semanal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Carga horaria debe ser un número positivo'),
];

export const updateCarreraMateriaValidation = [
  param('carreraId')
    .isInt({ min: 1 })
    .withMessage('ID de carrera inválido'),
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de asignación inválido'),
  body('materia_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('materia_id debe ser un entero válido'),
  body('cuatrimestre')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Cuatrimestre debe ser un número entre 1 y 12'),
  body('carga_horaria_semanal')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Carga horaria debe ser un número positivo'),
];

export const idParamValidation = [
  param('carreraId')
    .isInt({ min: 1 })
    .withMessage('ID de carrera inválido'),
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de asignación inválido'),
];
