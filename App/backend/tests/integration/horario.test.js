import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Horario Endpoints', () => {
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

    const carreraRes = await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Desarrollo de Software',
        slug: 'desarrollo-de-software',
      });
    carreraId = carreraRes.body.data.id;

    const materiaRes = await request(app)
      .post('/api/materias')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Programacion I',
        carrera_id: carreraId,
        cuatrimestre: 1,
      });
    materiaId = materiaRes.body.data.id;
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
          materia_id: materiaId,
          comision: 'A',
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
          profesor: 'Prof. Martinez',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.comision).toBe('A');
      expect(res.body.data.dia).toBe('Lunes');
      expect(res.body.data.horario).toBe('18:00 - 20:00');
      expect(res.body.data.aula).toBe('Aula 5');
      expect(res.body.data.profesor).toBe('Prof. Martinez');
      expect(res.body.data.materia_id).toBe(materiaId);
    });

    it('debería crear un horario sin comision (default Todas)', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: materiaId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.comision).toBe('Todas');
    });

    it('debería fallar al crear horario con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          materia_id: materiaId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta dia', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: materiaId,
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
          materia_id: materiaId,
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
          materia_id: materiaId,
          dia: 'Lunes',
          horario: '18:00 - 20:00',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta materia_id', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: 9999,
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
          materia_id: materiaId,
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
          materia_id: materiaId,
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
          materia_id: materiaId,
          comision: 'A',
          dia: 'Lunes',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });

      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: materiaId,
          comision: 'A',
          dia: 'Miercoles',
          horario: '18:00 - 20:00',
          aula: 'Aula 5',
        });

      await request(app)
        .post('/api/horarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: materiaId,
          comision: 'B',
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

    it('debería filtrar por materia_id', async () => {
      const res = await request(app)
        .get(`/api/horarios?materia_id=${materiaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data[0].materia).toBeDefined();
    });

    it('debería filtrar por comision', async () => {
      const res = await request(app)
        .get('/api/horarios?comision=A')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data.every(h => h.comision === 'A')).toBe(true);
    });

    it('debería filtrar por materia_id y comision', async () => {
      const res = await request(app)
        .get(`/api/horarios?materia_id=${materiaId}&comision=B`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].comision).toBe('B');
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
          materia_id: materiaId,
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
      expect(res.body.data.materia).toBeDefined();
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
          materia_id: materiaId,
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
        .send({
          dia: 'Martes',
          aula: 'Aula 7',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.dia).toBe('Martes');
      expect(res.body.data.aula).toBe('Aula 7');
    });

    it('debería actualizar el campo activo', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          activo: false,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.activo).toBe(false);
    });

    it('debería fallar al actualizar horario con token de profesor (solo admin)', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          dia: 'Martes',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el horario no existe', async () => {
      const res = await request(app)
        .put('/api/horarios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          dia: 'Martes',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si se asigna una materia inexistente', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          materia_id: 9999,
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .put(`/api/horarios/${horarioId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          dia: 'Martes',
        })
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
          materia_id: materiaId,
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
