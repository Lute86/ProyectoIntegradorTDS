import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Testimonio Endpoints', () => {
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

  describe('POST /api/testimonios', () => {
    it('deberia crear un testimonio con datos validos (admin)', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Maria Garcia',
          autor_carrera: 'Desarrollo de Software',
          texto: 'Excelente institucion, muy recomendable para estudiar.',
          visible: true,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.autor_nombre).toBe('Maria Garcia');
      expect(res.body.data.autor_carrera).toBe('Desarrollo de Software');
      expect(res.body.data.visible).toBe(true);
    });

    it('deberia crear un testimonio con profesor', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          autor_nombre: 'Juan Perez',
          texto: 'Muy buena experiencia educativa en el IFTS 29.',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.autor_nombre).toBe('Juan Perez');
      expect(res.body.data.visible).toBe(true);
    });

    it('deberia fallar si falta el nombre del autor', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          texto: 'Texto de prueba para el testimonio.',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('deberia fallar si el texto es muy corto', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Test',
          texto: 'Corto',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('deberia fallar sin token', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .send({
          autor_nombre: 'Test',
          texto: 'Texto de prueba para el testimonio.',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          autor_nombre: 'Test',
          texto: 'Texto de prueba para el testimonio.',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/testimonios', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Ana Lopez',
          texto: 'Primer testimonio de prueba para verificar el listado.',
          visible: true,
        });

      await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Pedro Ramirez',
          texto: 'Segundo testimonio de prueba para el listado general.',
          visible: false,
        });
    });

    it('deberia obtener todos los testimonios (sin auth)', async () => {
      const res = await request(app)
        .get('/api/testimonios')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('deberia filtrar por visibles', async () => {
      const res = await request(app)
        .get('/api/testimonios?visible=true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].visible).toBe(true);
    });
  });

  describe('GET /api/testimonios/:id', () => {
    let testimonioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Test',
          texto: 'Testimonio individual para obtener por ID.',
        });

      testimonioId = res.body.data.id;
    });

    it('deberia obtener un testimonio por ID (sin auth)', async () => {
      const res = await request(app)
        .get(`/api/testimonios/${testimonioId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testimonioId);
      expect(res.body.data.autor_nombre).toBe('Test');
    });

    it('deberia fallar con ID invalido', async () => {
      const res = await request(app)
        .get('/api/testimonios/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar si el testimonio no existe', async () => {
      const res = await request(app)
        .get('/api/testimonios/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/testimonios/:id', () => {
    let testimonioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Original',
          texto: 'Texto original del testimonio para actualizar.',
        });

      testimonioId = res.body.data.id;
    });

    it('deberia actualizar un testimonio (admin)', async () => {
      const res = await request(app)
        .put(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Actualizado',
          texto: 'Texto actualizado del testimonio para verificar.',
          visible: false,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.autor_nombre).toBe('Actualizado');
      expect(res.body.data.texto).toBe('Texto actualizado del testimonio para verificar.');
      expect(res.body.data.visible).toBe(false);
    });

    it('deberia actualizar un testimonio (profesor)', async () => {
      const res = await request(app)
        .put(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          autor_nombre: 'Actualizado por profesor',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.autor_nombre).toBe('Actualizado por profesor');
    });

    it('deberia fallar si el testimonio no existe', async () => {
      const res = await request(app)
        .put('/api/testimonios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .put(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          autor_nombre: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/testimonios/:id', () => {
    let testimonioId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'Para Eliminar',
          texto: 'Testimonio que sera eliminado en la prueba.',
        });

      testimonioId = res.body.data.id;
    });

    it('deberia eliminar un testimonio (admin)', async () => {
      const res = await request(app)
        .delete(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('deberia fallar si el testimonio no existe', async () => {
      const res = await request(app)
        .delete('/api/testimonios/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/testimonios/${testimonioId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
