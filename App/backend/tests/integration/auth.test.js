import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
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
    it('debería retornar 404 porque la ruta fue eliminada', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          password: '12345678',
        })
        .expect(404);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('testpass123', 10);
      await sequelize.models.User.create({
        nombre: 'Juan',
        email: 'juan@test.com',
        password_hash: passwordHash,
        rol: 'profesor',
        activo: true,
      });
    });

    it('debería loguear con credenciales válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'juan@test.com',
          password: 'testpass123',
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
      const passwordHash = await bcrypt.hash('testpass123', 10);
      const user = await sequelize.models.User.create({
        nombre: 'Juan',
        email: 'juan@test.com',
        password_hash: passwordHash,
        rol: 'profesor',
        activo: true,
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'juan@test.com', password: 'testpass123' });

      const token = loginRes.body.data.token;

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
