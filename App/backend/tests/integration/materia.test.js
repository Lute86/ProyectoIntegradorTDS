import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Materia Endpoints', () => {
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
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/materias', () => {
    it('debería crear una materia con datos válidos (admin)', async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Programación I' })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Programación I');
    });

    it('debería fallar al crear materia con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ nombre: 'Programación II' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({ nombre: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin/profesor)', async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({ nombre: 'Test' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/materias', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Materia 1' });

      await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Materia 2' });
    });

    it('debería obtener todas las materias (tutor)', async () => {
      const res = await request(app)
        .get('/api/materias')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería obtener todas las materias (profesor)', async () => {
      const res = await request(app)
        .get('/api/materias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería obtener todas las materias sin token (público)', async () => {
      const res = await request(app)
        .get('/api/materias')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Test Materia' });

      materiaId = res.body.data.id;
    });

    it('debería obtener una materia por ID (tutor)', async () => {
      const res = await request(app)
        .get(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(materiaId);
      expect(res.body.data.nombre).toBe('Test Materia');
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/materias/invalid')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .get('/api/materias/9999')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener una materia por ID sin token (público)', async () => {
      const res = await request(app)
        .get(`/api/materias/${materiaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(materiaId);
    });
  });

  describe('PUT /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Original' });

      materiaId = res.body.data.id;
    });

    it('debería actualizar una materia (admin)', async () => {
      const res = await request(app)
        .put(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Actualizada' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizada');
    });

    it('debería fallar al actualizar materia con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .put(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ nombre: 'Actualizada por Profesor' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .put('/api/materias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin/profesor)', async () => {
      const res = await request(app)
        .put(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({ nombre: 'Test' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Para Eliminar' });

      materiaId = res.body.data.id;
    });

    it('debería eliminar una materia (admin)', async () => {
      const res = await request(app)
        .delete(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      await request(app)
        .get(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .delete('/api/materias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/materias/${materiaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
