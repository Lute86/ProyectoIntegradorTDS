import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Noticia Endpoints', () => {
  let adminToken;
  let profesorToken;
  let tutorToken;
  let categoriaId;
  let noticiaId;

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

    const catRes = await request(app)
      .post('/api/categorias')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Test Categoria',
        slug: 'test-categoria',
        color: '#3B82F6',
      });
    categoriaId = catRes.body.data.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/noticias', () => {
    it('debería crear una noticia con datos válidos (admin)', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Noticia de prueba',
          slug: 'noticia-de-prueba',
          contenido: 'Contenido de la noticia',
          categoria_id: categoriaId,
          estado: 'borrador',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Noticia de prueba');
      expect(res.body.data.slug).toBe('noticia-de-prueba');
      expect(res.body.data.estado).toBe('borrador');
    });

    it('debería crear una noticia con profesor', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          titulo: 'Noticia profesor',
          slug: 'noticia-profesor',
          contenido: 'Contenido',
          estado: 'publicado',
          fecha_publicacion: new Date().toISOString(),
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Noticia profesor');
    });

    it('debería fallar si falta el titulo', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'test',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el slug ya existe', async () => {
      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Original',
          slug: 'slug-unico',
          contenido: 'test',
        });

      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Duplicado',
          slug: 'slug-unico',
          contenido: 'test',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si el estado es inválido', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Test',
          slug: 'test',
          estado: 'invalido',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .send({
          titulo: 'Test',
          slug: 'test',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          titulo: 'Test',
          slug: 'test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/noticias', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Primera Noticia',
          slug: 'primera-noticia',
          contenido: 'Contenido de la primera noticia',
          categoria_id: categoriaId,
          estado: 'publicado',
          fecha_publicacion: '2026-05-15T00:00:00.000Z',
        });

      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Segunda Noticia',
          slug: 'segunda-noticia',
          contenido: 'Contenido de la segunda noticia',
          estado: 'borrador',
        });
    });

    it('debería obtener todas las noticias (profesor)', async () => {
      const res = await request(app)
        .get('/api/noticias')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(2);
      expect(res.body.data.total).toBe(2);
    });

    it('debería filtrar por estado', async () => {
      const res = await request(app)
        .get('/api/noticias?estado=publicado')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].estado).toBe('publicado');
    });

    it('debería filtrar por categoria_id', async () => {
      const res = await request(app)
        .get(`/api/noticias?categoria_id=${categoriaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].categoria.id).toBe(categoriaId);
    });

    it('debería buscar por titulo', async () => {
      const res = await request(app)
        .get('/api/noticias?search=Primera')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.data[0].titulo).toBe('Primera Noticia');
    });

    it('debería paginar resultados', async () => {
      const res = await request(app)
        .get('/api/noticias?page=1&limit=1')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.data).toHaveLength(1);
      expect(res.body.data.total).toBe(2);
      expect(res.body.data.page).toBe(1);
      expect(res.body.data.totalPages).toBe(2);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/noticias')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/noticias/slug/:slug', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Por Slug',
          slug: 'por-slug',
          contenido: 'Contenido',
          estado: 'publicado',
        });
    });

    it('debería obtener una noticia por slug (profesor)', async () => {
      const res = await request(app)
        .get('/api/noticias/slug/por-slug')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('por-slug');
      expect(res.body.data.titulo).toBe('Por Slug');
    });

    it('debería fallar si la noticia no existe', async () => {
      const res = await request(app)
        .get('/api/noticias/slug/no-existe')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/noticias/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Noticia por ID',
          slug: 'noticia-por-id',
          contenido: 'Contenido de prueba',
          categoria_id: categoriaId,
          estado: 'publicado',
        });

      noticiaId = res.body.data.id;
    });

    it('debería obtener una noticia por ID (profesor)', async () => {
      const res = await request(app)
        .get(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(noticiaId);
      expect(res.body.data.titulo).toBe('Noticia por ID');
      expect(res.body.data.categoria).toBeDefined();
      expect(res.body.data.autor).toBeDefined();
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/noticias/invalid')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la noticia no existe', async () => {
      const res = await request(app)
        .get('/api/noticias/9999')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/noticias/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Original',
          slug: 'original',
          contenido: 'Contenido original',
        });

      noticiaId = res.body.data.id;
    });

    it('debería actualizar una noticia (admin)', async () => {
      const res = await request(app)
        .put(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Actualizado',
          contenido: 'Nuevo contenido',
          estado: 'publicado',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Actualizado');
      expect(res.body.data.contenido).toBe('Nuevo contenido');
      expect(res.body.data.estado).toBe('publicado');
    });

    it('debería actualizar una noticia (profesor)', async () => {
      const res = await request(app)
        .put(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .send({
          titulo: 'Actualizado por profesor',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.titulo).toBe('Actualizado por profesor');
    });

    it('debería fallar si el nuevo slug ya existe', async () => {
      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Otra',
          slug: 'otra',
        });

      const res = await request(app)
        .put(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          slug: 'otra',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la noticia no existe', async () => {
      const res = await request(app)
        .put('/api/noticias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .put(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${tutorToken}`)
        .send({
          titulo: 'Test',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/noticias/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Para Eliminar',
          slug: 'para-eliminar',
        });

      noticiaId = res.body.data.id;
    });

    it('debería eliminar una noticia (admin)', async () => {
      const res = await request(app)
        .delete(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const getRes = await request(app)
        .get(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(getRes.body.success).toBe(false);
    });

    it('debería fallar si la noticia no existe', async () => {
      const res = await request(app)
        .delete('/api/noticias/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor (no admin)', async () => {
      const res = await request(app)
        .delete(`/api/noticias/${noticiaId}`)
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/noticias/upload-imagen', () => {
    it('debería subir una imagen (admin)', async () => {
      const res = await request(app)
        .post('/api/noticias/upload-imagen')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toMatch(/^\/uploads\//);
      expect(res.body.data.filename).toBeDefined();
    });

    it('debería subir una imagen (profesor)', async () => {
      const res = await request(app)
        .post('/api/noticias/upload-imagen')
        .set('Authorization', `Bearer ${profesorToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toMatch(/^\/uploads\//);
    });

    it('debería fallar sin archivo', async () => {
      const res = await request(app)
        .post('/api/noticias/upload-imagen')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .post('/api/noticias/upload-imagen')
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor (no autorizado)', async () => {
      const res = await request(app)
        .post('/api/noticias/upload-imagen')
        .set('Authorization', `Bearer ${tutorToken}`)
        .attach('imagen', Buffer.from('fake-image-content'), 'test.jpg')
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
