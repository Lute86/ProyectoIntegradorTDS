import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('CarreraMateria Endpoints', () => {
  let carreraId;
  let materiaId;
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

    const carreraRes = await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Desarrollo de Software', slug: 'desarrollo-de-software' });
    carreraId = carreraRes.body.data.id;

    const materiaRes = await request(app)
      .post('/api/materias')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Programacion I' });
    materiaId = materiaRes.body.data.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/carreras/:carreraId/materias', () => {
    it('debería asignar materia a carrera (admin)', async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1, carga_horaria_semanal: 6 })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.carrera_id)).toBe(carreraId);
      expect(Number(res.body.data.materia_id)).toBe(materiaId);
      expect(res.body.data.cuatrimestre).toBe(1);
      expect(res.body.data.carga_horaria_semanal).toBe(6);
    });

    it('debería fallar si la materia ya está asignada', async () => {
      await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1 });

      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 2 })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera no existe', async () => {
      const res = await request(app)
        .post('/api/carreras/9999/materias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: 9999 })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .send({ materia_id: materiaId })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ materia_id: materiaId })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/carreras/:carreraId/materias', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1, carga_horaria_semanal: 6 });
    });

    it('debería obtener las materias de una carrera (público)', async () => {
      const res = await request(app)
        .get(`/api/carreras/${carreraId}/materias`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].materia).toBeDefined();
      expect(res.body.data[0].cuatrimestre).toBe(1);
    });

    it('debería filtrar por materia_id', async () => {
      const res = await request(app)
        .get(`/api/carreras/${carreraId}/materias?materia_id=${materiaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/carreras/:carreraId/materias/:id', () => {
    let asignacionId;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1 });
      asignacionId = res.body.data.id;
    });

    it('debería obtener una asignación por ID (admin)', async () => {
      const res = await request(app)
        .get(`/api/carreras/${carreraId}/materias/${asignacionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(asignacionId);
      expect(res.body.data.materia).toBeDefined();
      expect(res.body.data.carrera).toBeDefined();
    });

    it('debería fallar si la asignación no existe', async () => {
      const res = await request(app)
        .get(`/api/carreras/${carreraId}/materias/9999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/carreras/:carreraId/materias/:id', () => {
    let asignacionId;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1, carga_horaria_semanal: 4 });
      asignacionId = res.body.data.id;
    });

    it('debería actualizar la asignación (admin)', async () => {
      const res = await request(app)
        .put(`/api/carreras/${carreraId}/materias/${asignacionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ cuatrimestre: 2, carga_horaria_semanal: 8 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.cuatrimestre).toBe(2);
      expect(res.body.data.carga_horaria_semanal).toBe(8);
    });

    it('debería fallar si la asignación no existe', async () => {
      const res = await request(app)
        .put(`/api/carreras/${carreraId}/materias/9999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ cuatrimestre: 2 })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .put(`/api/carreras/${carreraId}/materias/${asignacionId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ cuatrimestre: 2 })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/carreras/:carreraId/materias/:id', () => {
    let asignacionId;

    beforeEach(async () => {
      const res = await request(app)
        .post(`/api/carreras/${carreraId}/materias`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ materia_id: materiaId, cuatrimestre: 1 });
      asignacionId = res.body.data.id;
    });

    it('debería eliminar la asignación (admin)', async () => {
      const res = await request(app)
        .delete(`/api/carreras/${carreraId}/materias/${asignacionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const listRes = await request(app)
        .get(`/api/carreras/${carreraId}/materias`)
        .expect(200);

      expect(listRes.body.data).toHaveLength(0);
    });

    it('debería fallar si la asignación no existe', async () => {
      const res = await request(app)
        .delete(`/api/carreras/${carreraId}/materias/9999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .delete(`/api/carreras/${carreraId}/materias/${asignacionId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
