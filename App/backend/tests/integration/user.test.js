import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('User Endpoints', () => {
  let adminToken;
  let userToken;
  let createdUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });

    // Create admin user and get token
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Admin',
        apellido: 'User',
        email: 'admin@test.com',
        password: '123456',
        rol: 'admin',
      });

    adminToken = adminRes.body.data.token;

    // Create regular user and get token
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Regular',
        apellido: 'User',
        email: 'user@test.com',
        password: '123456',
        rol: 'profesor',
      });

    userToken = userRes.body.data.token;
    createdUserId = userRes.body.data.user.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/usuarios', () => {
    it('debería listar todos los usuarios con token de admin', async () => {
      const res = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/usuarios')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de usuario no admin', async () => {
      const res = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/usuarios/:id', () => {
    it('debería obtener un usuario por id', async () => {
      const res = await request(app)
        .get(`/api/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdUserId);
      expect(res.body.data.email).toBe('user@test.com');
    });

    it('debería fallar con id inválido', async () => {
      const res = await request(app)
        .get('/api/usuarios/invalid')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/usuarios', () => {
    it('debería crear un usuario con token de admin', async () => {
      const res = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Nuevo',
          apellido: 'Usuario',
          email: 'nuevo@test.com',
          password: '123456',
          rol: 'tutor',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('nuevo@test.com');
      expect(res.body.data.rol).toBe('tutor');
    });

    it('debería fallar al crear usuario con email duplicado', async () => {
      await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Usuario',
          email: 'duplicado@test.com',
          password: '123456',
        });

      const res = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Otro',
          email: 'duplicado@test.com',
          password: '123456',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de usuario no admin', async () => {
      const res = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nombre: 'Nuevo',
          email: 'nuevo@test.com',
          password: '123456',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('debería actualizar un usuario', async () => {
      const res = await request(app)
        .put(`/api/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nombre: 'NombreActualizado',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('NombreActualizado');
    });

    it('debería fallar al actualizar con email duplicado', async () => {
      // Create another user first
      const otherRes = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Otro',
          email: 'otro@test.com',
          password: '123456',
        });

      const otherUserId = otherRes.body.data.id;

      // Try to update created user with other user's email
      const res = await request(app)
        .put(`/api/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'otro@test.com',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('debería eliminar un usuario con token de admin', async () => {
      const res = await request(app)
        .delete(`/api/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('debería fallar con token de usuario no admin', async () => {
      const res = await request(app)
        .delete(`/api/usuarios/${createdUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar al eliminar usuario inexistente', async () => {
      const res = await request(app)
        .delete('/api/usuarios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/usuarios/:id/toggle-active', () => {
    it('debería cambiar el estado activo del usuario', async () => {
      const res = await request(app)
        .patch(`/api/usuarios/${createdUserId}/toggle-active`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.activo).toBe(false);
    });

    it('debería fallar con token de usuario no admin', async () => {
      const res = await request(app)
        .patch(`/api/usuarios/${createdUserId}/toggle-active`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
