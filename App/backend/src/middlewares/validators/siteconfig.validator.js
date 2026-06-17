import { body } from 'express-validator';

export const updateSiteConfigValidation = [
  body('site_name')
    .optional()
    .notEmpty().withMessage('El nombre del sitio no puede estar vacío')
    .isString().withMessage('El nombre del sitio debe ser texto'),

  body('site_subtitle')
    .optional()
    .isString().withMessage('El subtítulo debe ser texto'),

  body('contact_email')
    .optional()
    .isEmail().withMessage('Email de contacto inválido')
    .normalizeEmail(),

  body('contact_phone')
    .optional()
    .isString().withMessage('El teléfono debe ser texto'),

  body('address')
    .optional()
    .isString().withMessage('La dirección debe ser texto'),

  body('seo_description')
    .optional()
    .isString().withMessage('La descripción SEO debe ser texto'),

  body('footer_text')
    .optional()
    .isString().withMessage('El texto del footer debe ser texto'),

  body('colors')
    .optional()
    .custom((value) => {
      if (value && (typeof value !== 'object' || Array.isArray(value))) {
        throw new Error('Colors debe ser un objeto JSON válido');
      }
      return true;
    }),

  body('layout')
    .optional()
    .custom((value) => {
      if (value && (typeof value !== 'object' || Array.isArray(value))) {
        throw new Error('Layout debe ser un objeto JSON válido');
      }
      return true;
    }),

  body('sections')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (!Array.isArray(value)) {
        throw new Error('Sections debe ser un array JSON válido');
      }
      const validSections = ['hero', 'statistics', 'careers', 'news', 'events', 'testimonials', 'gallery'];
      for (const section of value) {
        if (!section.id || !validSections.includes(section.id)) {
          throw new Error(`Sección inválida: ${section.id}. Válidas: ${validSections.join(', ')}`);
        }
        if (section.visible !== undefined && typeof section.visible !== 'boolean') {
          throw new Error('El campo visible debe ser booleano');
        }
        if (section.order !== undefined && typeof section.order !== 'number') {
          throw new Error('El campo order debe ser numérico');
        }
      }
      return true;
    }),

  body('typography')
    .optional()
    .custom((value) => {
      if (value && (typeof value !== 'object' || Array.isArray(value))) {
        throw new Error('Typography debe ser un objeto JSON válido');
      }
      return true;
    }),

  body('theme_preset')
    .optional()
    .isString().withMessage('El preset de tema debe ser texto'),

  body('social_links')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined) return true;
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('social_links debe ser un objeto JSON válido');
      }
      return true;
    }),
];
