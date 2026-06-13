import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Horario Endpoints', () => {
  let carreraId;
  let materiaId;
  let carreraMateriaId;
  let comisionAId;
  let comisionBId;
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

    const comisionARes = await request(app)
      .post('/api/comisiones')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        carrera_id: carreraId,
        nombre: 'A',
        anio_lectivo: 2026,
        semestre: 1,
      });
    comisionAId = comisionARes.body.data.id;

    const comisionBRes = await request(app)
      .post('/api/comisiones')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        carrera_id: carreraId,
        nombre: 'B',
        anio_lectivo: 2026,
        semestre: 1,
      });
    comisionBId = comisionBRes.body.data.id;

    await request(app)
      .post(`/api/comisiones/${comisionAId}/materias`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ carrera_materias_ids: [carreraMateriaId] });

    await request(app)
      .post(`/api/comisiones/${comisionBId}/materias`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ carrera_materias_ids: [carreraMateriaId] });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/horarios', () => {
    it('debería crear un horario con datos válidos (admin)', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
          profesor: 'Prof. Martinez',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.comision_id)).toBe(comisionAId);
      expect(res.body.data.dia).toBe('Lunes');
      expect(res.body.data.horario).toBe('18:00 - 20:00');
      expect(res.body.data.aula).toBe('Aula 5');
      expect(res.body.data.profesor).toBe('Prof. Martinez');
      expect(Number(res.body.data.carrera_materia_id)).toBe(carreraMateriaId);
    });

    it('debería fallar al crear horario con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta comision_id', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si falta dia', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si falta horario', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          aula: 'Aula 5',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta aula', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta carrera_materia_id', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera_materia no existe', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: 9999,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la comision no existe', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: 9999,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/horarios', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });

      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Miercoles',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });

      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionBId,
          dia: 'Martes',
          horario: '20:00 - 22:00',
          aula: 'Aula 7',
        });
    });

    it('debería obtener todos los horarios (público)', async () => {
      const res = await request(app)
        .get('/api/horarios')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('debería filtrar por carrera_materia_id', async () => {
      const res = await request(app)
        .get(`/api/horarios?carrera_materia_id=${carreraMateriaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[0].carreraMateria).toBeDefined();
    });

    it('debería filtrar por comision_id', async () => {
      const res = await request(app)
        .get(`/api/horarios?comision_id=${comisionAId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data.every(h => Number(h.comision_id) === comisionAId)).toBe(true);
    });

    it('debería filtrar por dia', async () => {
      const res = await request(app)
        .get('/api/horarios?dia=Lunes')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].dia).toBe('Lunes');
    });

    it('debería obtener horarios sin token (público)', async () => {
      const res = await request(app)
        .get('/api/horarios')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });
  });

  describe('GET /api/horarios/:id', () => {
    let horarioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });
      horarioId = res.body.data.id;
    });

    it('debería obtener un horario por ID (público)', async () => {
      const res = await request(app)
        .get(`/api/horarios/${horarioId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(horarioId);
      expect(res.body.data.dia).toBe('Lunes');
      expect(res.body.data.carreraMateria).toBeDefined();
      expect(res.body.data.comisionInfo).toBeDefined();
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/horarios/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el horario no existe', async () => {
      const res = await request(app)
        .get('/api/horarios/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener un horario por ID sin token (público)', async () => {
      const res = await request(app)
        .get(`/api/horarios/${horarioId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(horarioId);
    });
  });

  describe('PUT /api/horarios/:id', () => {
    let horarioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });
      horarioId = res.body.data.id;
    });

    it('debería actualizar un horario (admin)', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ dia: 'Martes', aula: 'Aula 7' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.dia).toBe('Martes');
      expect(res.body.data.aula).toBe('Aula 7');
    });

    it('debería actualizar el campo activo', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.activo).toBe(false);
    });

    it('debería fallar al actualizar horario con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ dia: 'Martes' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el horario no existe', async () => {
      const res = await request(app)
        .put('/api/horarios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ dia: 'Martes' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si se asigna una carrera_materia inexistente', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ carrera_materia_id: 9999 })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({ dia: 'Martes' })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/horarios/:id', () => {
    let horarioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          carrera_materia_id: carreraMateriaId,
          comision_id: comisionAId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });
      horarioId = res.body.data.id;
    });

    it('debería eliminar un horario (admin)', async () => {
      const res = await request(app)
        .delete(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      await request(app)
        .get(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('debería fallar si el horario no existe', async () => {
      const res = await request(app)
        .delete('/api/horarios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
