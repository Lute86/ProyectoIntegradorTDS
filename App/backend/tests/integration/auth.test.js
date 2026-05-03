import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('debería registrar un usuario con datos válidos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@test.com',
          password: '123456',
          rol: 'profesor',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('juan@test.com');
    });

    it('debería fallar si falta el email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          password: '123456',
        })
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si el email ya está registrado', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          password: '123456',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Pedro',
          email: 'juan@test.com',
          password: '123456',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          password: '123456',
        });
    });

    it('debería loguear con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@test.com',
          password: '123456',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('debería fallar con password incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('debería obtener el perfil con token válido', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          password: '123456',
        });

      const token = registerRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('juan@test.com');
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
