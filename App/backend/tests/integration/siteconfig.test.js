import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('SiteConfig Endpoints', () => {
  let adminToken;
  let profesorToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Admin',
        email: 'admin@test.com',
        password: '123456',
        rol: 'admin',
      });
    adminToken = adminRes.body.data.token;

    const profesorRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Profesor',
        email: 'profesor@test.com',
        password: '123456',
        rol: 'profesor',
      });
    profesorToken = profesorRes.body.data.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/config', () => {
    it('debería obtener configuración por defecto (pública)', async () => {
      const res = await request(app)
        .get('/api/config')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.site_name).toBeDefined();
    });

    it('debería retornar configuración con secciones válidas', async () => {
      const res = await request(app)
        .get('/api/config')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.sections).toBeDefined();
      const validSections = ['hero', 'statistics', 'careers', 'news', 'events', 'testimonials', 'gallery'];
      if (Array.isArray(res.body.data.sections)) {
        res.body.data.sections.forEach(section => {
          expect(validSections).toContain(section.id || section.name);
        });
      }
    });
  });

  describe('PUT /api/config', () => {
    it('debería actualizar configuración con datos válidos (admin)', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          site_name: 'IFTS 29 - Nueva Web',
          site_subtitle: 'Instituto de Formación Técnica',
          contact_email: 'info@ifts29.edu.ar',
          theme_preset: 'modern',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.site_name).toBe('IFTS 29 - Nueva Web');
      expect(res.body.data.contact_email).toBe('info@ifts29.edu.ar');
    });

    it('debería actualizar secciones válidas', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sections: [
            { id: 'hero', visible: true, order: 1 },
            { id: 'statistics', visible: false, order: 2 },
            { id: 'careers', visible: true, order: 3 },
          ],
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.sections).toBeDefined();
    });

    it('debería fallar con sección inválida', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sections: [
            { id: 'invalid_section', visible: true, order: 1 },
          ],
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar con email inválido', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          contact_email: 'invalid-email',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .put('/api/config')
        .send({
          site_name: 'Test',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          site_name: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería validar campos JSON (colors, layout, typography)', async () => {
      const res = await request(app)
        .put('/api/config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          colors: { primary: '#FF0000', secondary: '#00FF00' },
          layout: { header: 'compact', sidebar: false },
          typography: { fontFamily: 'Roboto', fontSize: '14px' },
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });
});
