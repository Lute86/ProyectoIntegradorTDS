import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Categoria Endpoints', () => {
  let adminToken;
  let profesorToken;
  let tutorToken;

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

    const tutorRes = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Tutor',
        email: 'tutor@test.com',
        password: '123456',
        rol: 'tutor',
      });
    tutorToken = tutorRes.body.data.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/categorias', () => {
    it('debería crear una categoria con datos válidos (admin)', async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Inscripciones',
          slug: 'inscripciones',
          color: '#3B82F6',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Inscripciones');
      expect(res.body.data.slug).toBe('inscripciones');
      expect(res.body.data.color).toBe('#3B82F6');
    });

    it('debería fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'test',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si el slug ya existe', async () => {
      await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Categoria 1',
          slug: 'categoria-1',
        });

      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Categoria 2',
          slug: 'categoria-1',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el color es inválido', async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test',
          slug: 'test',
          color: 'rojo',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/categorias')
        .send({
          nombre: 'Test',
          slug: 'test',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          nombre: 'Test',
          slug: 'test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/categorias', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Eventos',
          slug: 'eventos',
          color: '#10B981',
        });

      await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Exámenes',
          slug: 'examenes',
          color: '#EF4444',
        });
    });

    it('debería obtener todas las categorias (profesor)', async () => {
      const res = await request(app)
        .get('/api/categorias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería obtener todas las categorias (tutor)', async () => {
      const res = await request(app)
        .get('/api/categorias')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería obtener todas las categorias sin token (público)', async () => {
      const res = await request(app)
        .get('/api/categorias')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/categorias/:id', () => {
    let categoriaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test Categoria',
          slug: 'test-categoria',
        });

      categoriaId = res.body.data.id;
    });

    it('debería obtener una categoria por ID (profesor)', async () => {
      const res = await request(app)
        .get(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(categoriaId);
      expect(res.body.data.nombre).toBe('Test Categoria');
    });

    it('debería obtener una categoria por ID (tutor)', async () => {
      const res = await request(app)
        .get(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(categoriaId);
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/categorias/invalid')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la categoria no existe', async () => {
      const res = await request(app)
        .get('/api/categorias/9999')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener una categoria por ID sin token (público)', async () => {
      const res = await request(app)
        .get(`/api/categorias/${categoriaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(categoriaId);
    });
  });

  describe('PUT /api/categorias/:id', () => {
    let categoriaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Original',
          slug: 'original',
        });

      categoriaId = res.body.data.id;
    });

    it('debería actualizar una categoria (admin)', async () => {
      const res = await request(app)
        .put(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Actualizado',
          color: '#8B5CF6',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizado');
      expect(res.body.data.color).toBe('#8B5CF6');
    });

    it('debería fallar si el nuevo slug ya existe', async () => {
      await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Otra',
          slug: 'otra',
        });

      const res = await request(app)
        .put(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'otra',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la categoria no existe', async () => {
      const res = await request(app)
        .put('/api/categorias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .put(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          nombre: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/categorias/:id', () => {
    let categoriaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Para Eliminar',
          slug: 'para-eliminar',
        });

      categoriaId = res.body.data.id;
    });

    it('debería eliminar una categoria (admin)', async () => {
      const res = await request(app)
        .delete(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('debería fallar si la categoria no existe', async () => {
      const res = await request(app)
        .delete('/api/categorias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/categorias/${categoriaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
