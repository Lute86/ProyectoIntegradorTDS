import { body, param } from 'express-validator';

export const createUserValidation = [
  body('nombre')
    .notEmpty()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre es requerido y debe tener al menos 2 caracteres'),
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
    .withMessage('Rol inválido (admin/profesor/tutor)'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL inválida'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),
];

export const updateUserValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .optional()
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password debe tener al menos 6 caracteres'),
  body('rol')
    .optional()
    .isIn(['admin', 'profesor', 'tutor'])
    .withMessage('Rol inválido (admin/profesor/tutor)'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL inválida'),
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
