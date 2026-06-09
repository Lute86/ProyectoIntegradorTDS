import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Evento Endpoints', () => {
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

  describe('POST /api/eventos', () => {
    it('deberia crear un evento con datos validos (admin)', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Charla de prueba',
          descripcion: 'Descripcion de la charla',
          fecha: '2026-07-15',
          ubicacion: 'Auditorio',
          estado: 'confirmado',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Charla de prueba');
      expect(res.body.data.fecha).toBe('2026-07-15');
      expect(res.body.data.estado).toBe('confirmado');
    });

    it('deberia crear un evento con profesor', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          nombre: 'Taller de prueba',
          descripcion: 'Taller intensivo',
          fecha: '2026-08-10',
          ubicacion: 'Laboratorio',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Taller de prueba');
      expect(res.body.data.estado).toBe('pendiente');
    });

    it('deberia fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fecha: '2026-07-15',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('deberia fallar si falta la fecha', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('deberia fallar si el estado es invalido', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test',
          fecha: '2026-07-15',
          estado: 'invalido',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar sin token', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .send({
          nombre: 'Test',
          fecha: '2026-07-15',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          nombre: 'Test',
          fecha: '2026-07-15',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/eventos', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Evento Confirmado',
          fecha: '2026-07-15',
          estado: 'confirmado',
        });

      await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Evento Pendiente',
          fecha: '2026-09-05',
          estado: 'pendiente',
        });
    });

    it('deberia obtener todos los eventos (sin auth)', async () => {
      const res = await request(app)
        .get('/api/eventos')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('deberia filtrar por estado', async () => {
      const res = await request(app)
        .get('/api/eventos?estado=confirmado')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].estado).toBe('confirmado');
    });

    it('deberia filtrar por fecha_desde', async () => {
      const res = await request(app)
        .get('/api/eventos?fecha_desde=2026-08-01')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].nombre).toBe('Evento Pendiente');
    });
  });

  describe('GET /api/eventos/:id', () => {
    let eventoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Evento Test',
          fecha: '2026-07-15',
        });

      eventoId = res.body.data.id;
    });

    it('deberia obtener un evento por ID (sin auth)', async () => {
      const res = await request(app)
        .get(`/api/eventos/${eventoId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(eventoId);
      expect(res.body.data.nombre).toBe('Evento Test');
    });

    it('deberia fallar con ID invalido', async () => {
      const res = await request(app)
        .get('/api/eventos/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar si el evento no existe', async () => {
      const res = await request(app)
        .get('/api/eventos/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/eventos/:id', () => {
    let eventoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Original',
          fecha: '2026-07-15',
        });

      eventoId = res.body.data.id;
    });

    it('deberia actualizar un evento (admin)', async () => {
      const res = await request(app)
        .put(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Actualizado',
          descripcion: 'Nueva descripcion',
          estado: 'confirmado',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizado');
      expect(res.body.data.descripcion).toBe('Nueva descripcion');
      expect(res.body.data.estado).toBe('confirmado');
    });

    it('deberia actualizar un evento (profesor)', async () => {
      const res = await request(app)
        .put(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          nombre: 'Actualizado por profesor',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizado por profesor');
    });

    it('deberia fallar si el evento no existe', async () => {
      const res = await request(app)
        .put('/api/eventos/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .put(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          nombre: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/eventos/:id', () => {
    let eventoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Para Eliminar',
          fecha: '2026-07-15',
        });

      eventoId = res.body.data.id;
    });

    it('deberia eliminar un evento (admin)', async () => {
      const res = await request(app)
        .delete(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('deberia fallar si el evento no existe', async () => {
      const res = await request(app)
        .delete('/api/eventos/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/eventos/${eventoId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
