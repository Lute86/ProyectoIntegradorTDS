import { body } from 'express-validator';

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Password requerido'),
];

export const registerValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .optional()
    .trim(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password debe tener al menos 6 caracteres'),
  body('rol')
    .optional()
    .isIn(['admin', 'profesor', 'tutor'])
    .withMessage('Rol inválido'),
];

export const refreshValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token requerido'),
];
