import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Comision Endpoints', () => {
  let carreraId;
  let materiaId;
  let carreraMateriaId;
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

    const cmRes = await request(app)
      .post(`/api/carreras/${carreraId}/materias`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ materia_id: materiaId, cuatrimestre: 1, carga_horaria_semanal: 6 });
    carreraMateriaId = cmRes.body.data.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/comisiones', () => {
    it('debería crear una comisión con datos válidos (admin)', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('A');
      expect(res.body.data.anio_lectivo).toBe(2026);
      expect(res.body.data.semestre).toBe(1);
      expect(res.body.data.activo).toBe(true);
    });

    it('debería crear una comisión con nombre numérico', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: '1',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('1');
    });

    it('debería crear una comisión con nombre mixto', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'MAÑANA',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('MAÑANA');
    });

    it('debería fallar al crear comisión con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta nombre', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si falta carrera_materia_id', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta anio_lectivo', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          semestre: 1,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta semestre', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si semestre es inválido', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 3,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera_materia no existe', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: 9999,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el nombre excede 20 caracteres', async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A'.repeat(21),
          anio_lectivo: 2026,
          semestre: 1,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/comisiones', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        });

      await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'B',
          anio_lectivo: 2026,
          semestre: 1,
        });

      await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: '1',
          anio_lectivo: 2026,
          semestre: 2,
        });
    });

    it('debería obtener todas las comisiones (público)', async () => {
      const res = await request(app)
        .get('/api/comisiones')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('debería filtrar por carrera_id', async () => {
      const res = await request(app)
        .get(`/api/comisiones?carrera_id=${carreraId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('debería filtrar por anio_lectivo', async () => {
      const res = await request(app)
        .get('/api/comisiones?anio_lectivo=2026')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('debería filtrar por semestre', async () => {
      const res = await request(app)
        .get('/api/comisiones?semestre=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería filtrar por carrera_materia_id', async () => {
      const res = await request(app)
        .get(`/api/comisiones?carrera_materia_id=${carreraMateriaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('debería obtener comisiones sin token (público)', async () => {
      const res = await request(app)
        .get('/api/comisiones')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });
  });

  describe('GET /api/comisiones/:id', () => {
    let comisionId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        });
      comisionId = res.body.data.id;
    });

    it('debería obtener una comisión por ID (público)', async () => {
      const res = await request(app)
        .get(`/api/comisiones/${comisionId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(comisionId);
      expect(res.body.data.nombre).toBe('A');
      expect(res.body.data.carreraMateria).toBeDefined();
    });

    it('debería incluir horarios vacíos al inicio', async () => {
      const res = await request(app)
        .get(`/api/comisiones/${comisionId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.horarios).toBeDefined();
      expect(res.body.data.horarios).toHaveLength(0);
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/comisiones/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la comisión no existe', async () => {
      const res = await request(app)
        .get('/api/comisiones/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener una comisión por ID sin token (público)', async () => {
      const res = await request(app)
        .get(`/api/comisiones/${comisionId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(comisionId);
    });
  });

  describe('PUT /api/comisiones/:id', () => {
    let comisionId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        });
      comisionId = res.body.data.id;
    });

    it('debería actualizar una comisión (admin)', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'B' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('B');
    });

    it('debería actualizar el campo activo', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.activo).toBe(false);
    });

    it('debería actualizar el semestre', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ semestre: 2 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.semestre).toBe(2);
    });

    it('debería fallar al actualizar comisión con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ nombre: 'B' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la comisión no existe', async () => {
      const res = await request(app)
        .put('/api/comisiones/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'B' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si se asigna una carrera_materia inexistente', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ carrera_materia_id: 9999 })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .put(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({ nombre: 'B' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/comisiones/:id', () => {
    let comisionId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/comisiones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          nombre: 'A',
          anio_lectivo: 2026,
          semestre: 1,
        });
      comisionId = res.body.data.id;
    });

    it('debería eliminar una comisión sin horarios (admin)', async () => {
      const res = await request(app)
        .delete(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      await request(app)
        .get(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('debería fallar si la comisión no existe', async () => {
      const res = await request(app)
        .delete('/api/comisiones/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar al eliminar comisión con horarios asociados', async () => {
      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });

      const res = await request(app)
        .delete(`/api/comisiones/${comisionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });
});
