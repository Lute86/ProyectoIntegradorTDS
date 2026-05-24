import { body, param } from 'express-validator';

export const createNoticiaValidation = [
  body('titulo')
    .notEmpty()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Titulo es requerido y debe tener al menos 3 caracteres'),
  body('slug')
    .notEmpty()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug invalido (solo minusculas, numeros y guiones)'),
  body('contenido')
    .optional()
    .trim(),
  body('imagen_destacada_url')
    .optional()
    .trim(),
  body('categoria_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('categoria_id debe ser un entero valido'),
  body('autor_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('autor_id debe ser un entero valido'),
  body('estado')
    .optional()
    .isIn(['borrador', 'publicado', 'archivado'])
    .withMessage('Estado invalido (borrador, publicado, archivado)'),
  body('fecha_publicacion')
    .optional()
    .isISO8601()
    .withMessage('fecha_publicacion debe ser una fecha valida'),
];

export const updateNoticiaValidation = [
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Titulo debe tener al menos 3 caracteres'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug invalido (solo minusculas, numeros y guiones)'),
  body('contenido')
    .optional()
    .trim(),
  body('imagen_destacada_url')
    .optional()
    .trim(),
  body('categoria_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('categoria_id debe ser un entero valido'),
  body('autor_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('autor_id debe ser un entero valido'),
  body('estado')
    .optional()
    .isIn(['borrador', 'publicado', 'archivado'])
    .withMessage('Estado invalido (borrador, publicado, archivado)'),
  body('fecha_publicacion')
    .optional()
    .isISO8601()
    .withMessage('fecha_publicacion debe ser una fecha valida'),
];

export const idParamValidation = [
  param('id')
    .isInt()
    .withMessage('ID invalido'),
];

export const slugParamValidation = [
  param('slug')
    .notEmpty()
    .trim()
    .withMessage('Slug requerido'),
];
