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

export const refreshValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token requerido'),
];
