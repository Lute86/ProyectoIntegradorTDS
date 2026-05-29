import { body, param } from 'express-validator';

export const createConsultaValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
  body('email')
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage('Email debe ser una dirección válida'),
  body('asunto')
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Asunto es requerido y debe tener al menos 3 caracteres'),
  body('mensaje')
    .notEmpty()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Mensaje es requerido y debe tener al menos 10 caracteres'),
];

export const updateConsultaValidation = [
  body('respuesta')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Respuesta debe tener al menos 10 caracteres'),
  body('respondido')
    .optional()
    .isBoolean()
    .withMessage('Respondido debe ser un valor booleano'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
];
