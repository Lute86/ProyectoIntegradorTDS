import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Galeria Endpoints', () => {
  let adminToken;
  let profesorToken;
  let tutorToken;
  let imagenId;

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

  describe('POST /api/imagenes', () => {
    it('deberia crear una imagen con datos validos (admin)', async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('titulo', 'Imagen de prueba')
        .field('categoria', 'Instalaciones')
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Imagen de prueba');
      expect(res.body.data.categoria).toBe('Instalaciones');
      expect(res.body.data.url).toMatch(/^\/uploads\//);
    });

    it('deberia crear una imagen con profesor', async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${profesorToken}`)
        .field('titulo', 'Imagen profesor')
        .field('categoria', 'Eventos')
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Imagen profesor');
      expect(res.body.data.categoria).toBe('Eventos');
    });

    it('deberia crear una imagen sin archivo (url directa)', async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Imagen externa',
          url: 'https://ejemplo.com/imagen.jpg',
          categoria: 'Alumnos',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toBe('https://ejemplo.com/imagen.jpg');
    });

    it('deberia fallar sin token', async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .send({
          titulo: 'Test',
          url: 'https://ejemplo.com/img.jpg',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          titulo: 'Test',
          url: 'https://ejemplo.com/img.jpg',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/imagenes', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Imagen Instalaciones',
          url: 'https://ejemplo.com/instalacion.jpg',
          categoria: 'Instalaciones',
        });

      await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Imagen Eventos',
          url: 'https://ejemplo.com/evento.jpg',
          categoria: 'Eventos',
        });

      await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Imagen Alumnos',
          url: 'https://ejemplo.com/alumno.jpg',
          categoria: 'Alumnos',
        });
    });

    it('deberia obtener todas las imagenes (profesor)', async () => {
      const res = await request(app)
        .get('/api/imagenes')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('deberia obtener todas las imagenes sin token (publico)', async () => {
      const res = await request(app)
        .get('/api/imagenes')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('deberia filtrar por categoria', async () => {
      const res = await request(app)
        .get('/api/imagenes?categoria=Eventos')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].categoria).toBe('Eventos');
    });

    it('deberia filtrar por entidad_id', async () => {
      const res = await request(app)
        .get('/api/imagenes?entidad_id=999')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/imagenes/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Imagen Test',
          url: 'https://ejemplo.com/test.jpg',
          categoria: 'Instalaciones',
        });

      imagenId = res.body.data.id;
    });

    it('deberia obtener una imagen por ID (profesor)', async () => {
      const res = await request(app)
        .get(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(imagenId);
      expect(res.body.data.titulo).toBe('Imagen Test');
    });

    it('deberia obtener una imagen por ID sin token (publico)', async () => {
      const res = await request(app)
        .get(`/api/imagenes/${imagenId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(imagenId);
    });

    it('deberia fallar con ID invalido', async () => {
      const res = await request(app)
        .get('/api/imagenes/invalid')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar si la imagen no existe', async () => {
      const res = await request(app)
        .get('/api/imagenes/9999')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/imagenes/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Original',
          url: 'https://ejemplo.com/original.jpg',
          categoria: 'Instalaciones',
        });

      imagenId = res.body.data.id;
    });

    it('deberia actualizar una imagen (admin)', async () => {
      const res = await request(app)
        .put(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Actualizado',
          categoria: 'Eventos',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Actualizado');
      expect(res.body.data.categoria).toBe('Eventos');
    });

    it('deberia actualizar una imagen (profesor)', async () => {
      const res = await request(app)
        .put(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          titulo: 'Actualizado por profesor',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Actualizado por profesor');
    });

    it('deberia fallar si la imagen no existe', async () => {
      const res = await request(app)
        .put('/api/imagenes/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .put(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          titulo: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/imagenes/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/imagenes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Para Eliminar',
          url: 'https://ejemplo.com/eliminar.jpg',
        });

      imagenId = res.body.data.id;
    });

    it('deberia eliminar una imagen (admin)', async () => {
      const res = await request(app)
        .delete(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('deberia fallar si la imagen no existe', async () => {
      const res = await request(app)
        .delete('/api/imagenes/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/imagenes/${imagenId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/imagenes/upload-imagen', () => {
    it('deberia subir una imagen (admin)', async () => {
      const res = await request(app)
        .post('/api/imagenes/upload-imagen')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toMatch(/^\/uploads\//);
      expect(res.body.data.filename).toBeDefined();
    });

    it('deberia subir una imagen (profesor)', async () => {
      const res = await request(app)
        .post('/api/imagenes/upload-imagen')
        .set('Authorization', `Bearer ${profesorToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toMatch(/^\/uploads\//);
    });

    it('deberia fallar sin archivo', async () => {
      const res = await request(app)
        .post('/api/imagenes/upload-imagen')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar sin token', async () => {
      const res = await request(app)
        .post('/api/imagenes/upload-imagen')
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('deberia fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/imagenes/upload-imagen')
        .set('Authorization', `Bearer ${tutorToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
