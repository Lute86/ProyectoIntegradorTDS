import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Consulta Endpoints', () => {
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

  describe('POST /api/consultas', () => {
    it('debería crear una consulta con datos válidos (público)', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan Pérez',
          email: 'juan@test.com',
          asunto: 'Consulta sobre inscripción',
          mensaje: 'Hola, quisiera saber cuándo son las inscripciones para el próximo cuatrimestre.',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Juan Pérez');
      expect(res.body.data.email).toBe('juan@test.com');
      expect(res.body.data.asunto).toBe('Consulta sobre inscripción');
      expect(res.body.data.respondido).toBe(false);
      expect(res.body.data.respuesta).toBeFalsy();
    });

    it('debería fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          email: 'juan@test.com',
          asunto: 'Test',
          mensaje: 'Mensaje de prueba con suficientes caracteres',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si falta el email', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan',
          asunto: 'Test',
          mensaje: 'Mensaje de prueba con suficientes caracteres',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el email es inválido', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan',
          email: 'no-es-email',
          asunto: 'Test',
          mensaje: 'Mensaje de prueba con suficientes caracteres',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si falta el asunto', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          mensaje: 'Mensaje de prueba con suficientes caracteres',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el mensaje es muy corto', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          asunto: 'Test',
          mensaje: 'Corto',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('no requiere token de autenticación', async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan',
          email: 'juan@test.com',
          asunto: 'Test',
          mensaje: 'Mensaje de prueba con suficientes caracteres',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/consultas', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Consulta 1',
          email: 'consulta1@test.com',
          asunto: 'Asunto 1',
          mensaje: 'Este es el mensaje de la consulta uno con suficientes caracteres.',
        });

      await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Consulta 2',
          email: 'consulta2@test.com',
          asunto: 'Asunto 2',
          mensaje: 'Este es el mensaje de la consulta dos con suficientes caracteres.',
        });
    });

    it('debería obtener todas las consultas (admin)', async () => {
      const res = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2);
      expect(res.body.data.total).toBe(2);
    });

    it('debería obtener todas las consultas (profesor)', async () => {
      const res = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2);
    });

    it('debería obtener todas las consultas (tutor)', async () => {
      const res = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/consultas')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería filtrar por respondido', async () => {
      const consultas = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${adminToken}`);

      const firstId = consultas.body.data.data[0].id;

      await request(app)
        .put(`/api/consultas/${firstId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ respondido: true, respuesta: 'Respuesta de prueba con suficientes caracteres.' });

      const res = await request(app)
        .get('/api/consultas?respondido=true')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].respondido).toBe(true);
    });

    it('debería buscar por nombre', async () => {
      const res = await request(app)
        .get('/api/consultas?search=Consulta 1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].nombre).toBe('Consulta 1');
    });
  });

  describe('GET /api/consultas/unread/count', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Consulta 1',
          email: 'c1@test.com',
          asunto: 'Asunto 1',
          mensaje: 'Mensaje de prueba con suficientes caracteres para la consulta.',
        });

      await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Consulta 2',
          email: 'c2@test.com',
          asunto: 'Asunto 2',
          mensaje: 'Otro mensaje de prueba con suficientes caracteres.',
        });
    });

    it('debería devolver el conteo de consultas sin leer', async () => {
      const res = await request(app)
        .get('/api/consultas/unread/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.count).toBe(2);
    });

    it('debería decrementar al marcar como leída', async () => {
      const consultas = await request(app)
        .get('/api/consultas')
        .set('Authorization', `Bearer ${adminToken}`);

      const firstId = consultas.body.data.data[0].id;

      await request(app)
        .put(`/api/consultas/${firstId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ respondido: true });

      const res = await request(app)
        .get('/api/consultas/unread/count')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.count).toBe(1);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/consultas/unread/count')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/consultas/:id', () => {
    let consultaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Detalle Test',
          email: 'detalle@test.com',
          asunto: 'Asunto Detalle',
          mensaje: 'Mensaje para probar el endpoint de detalle con suficientes caracteres.',
        });

      consultaId = res.body.data.id;
    });

    it('debería obtener una consulta por ID (admin)', async () => {
      const res = await request(app)
        .get(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(consultaId);
      expect(res.body.data.nombre).toBe('Detalle Test');
    });

    it('debería obtener una consulta por ID (profesor)', async () => {
      const res = await request(app)
        .get(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/consultas/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la consulta no existe', async () => {
      const res = await request(app)
        .get('/api/consultas/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get(`/api/consultas/${consultaId}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/consultas/:id', () => {
    let consultaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Para Actualizar',
          email: 'update@test.com',
          asunto: 'Asunto Update',
          mensaje: 'Mensaje para probar la actualización con suficientes caracteres.',
        });

      consultaId = res.body.data.id;
    });

    it('debería marcar como leída (admin)', async () => {
      const res = await request(app)
        .put(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ respondido: true })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.respondido).toBe(true);
    });

    it('debería responder una consulta (admin)', async () => {
      const res = await request(app)
        .put(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          respondido: true,
          respuesta: 'Gracias por su consulta. La respuesta tiene suficientes caracteres.',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.respondido).toBe(true);
      expect(res.body.data.respuesta).toBe('Gracias por su consulta. La respuesta tiene suficientes caracteres.');
    });

    it('debería actualizar con token de profesor', async () => {
      const res = await request(app)
        .put(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({ respondido: true })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('debería fallar si la consulta no existe', async () => {
      const res = await request(app)
        .put('/api/consultas/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ respondido: true })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .put(`/api/consultas/${consultaId}`)
        .send({ respondido: true })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con respuesta muy corta', async () => {
      const res = await request(app)
        .put(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ respuesta: 'Corto' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/consultas/:id', () => {
    let consultaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Para Eliminar',
          email: 'delete@test.com',
          asunto: 'Asunto Delete',
          mensaje: 'Mensaje para probar la eliminación con suficientes caracteres.',
        });

      consultaId = res.body.data.id;
    });

    it('debería eliminar una consulta (admin)', async () => {
      const res = await request(app)
        .delete(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('debería fallar si la consulta no existe', async () => {
      const res = await request(app)
        .delete('/api/consultas/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/consultas/${consultaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .delete(`/api/consultas/${consultaId}`)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
