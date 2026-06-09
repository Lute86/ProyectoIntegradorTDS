import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Stats Endpoints', () => {
  let adminToken;
  let profesorToken;
  let tutorToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    ({ token: adminToken } = await createAndLogin({ nombre: 'Admin', email: 'admin@test.com', rol: 'admin' }));
    ({ token: profesorToken } = await createAndLogin({ nombre: 'Profesor', email: 'profesor@test.com', rol: 'profesor' }));
    ({ token: tutorToken } = await createAndLogin({ nombre: 'Tutor', email: 'tutor@test.com', rol: 'tutor' }));

    // Crear carreras y materias para las estadísticas
    await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Desarrollo de Software',
        slug: 'desarrollo-software',
        activa: true,
      });

    await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Análisis de Sistemas',
        slug: 'analisis-sistemas',
        activa: true,
      });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/stats/dashboard', () => {
    it('debería obtener estadísticas del dashboard (admin)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
      expect(res.body.data.materias).toBeDefined();
      expect(res.body.data.staff).toBeDefined();
      expect(res.body.data.carreras).toBeGreaterThanOrEqual(0);
      expect(res.body.data.staff).toBeGreaterThanOrEqual(1); // Al menos el admin
    });

    it('debería contar carreras activas', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.carreras).toBeGreaterThanOrEqual(2);
    });

    it('debería contar staff (admin + profesor + tutor)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.staff).toBeGreaterThanOrEqual(3);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener estadísticas con token de profesor', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
    });

    it('debería obtener estadísticas con token de tutor', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
    });
  });
});
