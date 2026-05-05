import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Carrera Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/carreras', () => {
    it('debería crear una carrera con datos válidos', async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Desarrollo de Software',
          slug: 'desarrollo-de-software',
          descripcion: 'Carrera técnica',
          duracion: 3,
          modalidad: 'virtual',
          color: '#3B82F6',
          activa: true,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Desarrollo de Software');
      expect(res.body.data.slug).toBe('desarrollo-de-software');
    });

    it('debería fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          slug: 'test',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si el slug ya existe', async () => {
      await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Carrera 1',
          slug: 'carrera-1',
        });

      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Carrera 2',
          slug: 'carrera-1',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la modalidad es inválida', async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Test',
          slug: 'test',
          modalidad: 'invalid',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/carreras', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Carrera Virtual',
          slug: 'carrera-virtual',
          modalidad: 'virtual',
          activa: true,
        });

      await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Carrera Presencial',
          slug: 'carrera-presencial',
          modalidad: 'presencial',
          activa: false,
        });
    });

    it('debería obtener todas las carreras', async () => {
      const res = await request(app)
        .get('/api/carreras')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería filtrar por modalidad', async () => {
      const res = await request(app)
        .get('/api/carreras?modalidad=virtual')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].modalidad).toBe('virtual');
    });

    it('debería filtrar por estado activa', async () => {
      const res = await request(app)
        .get('/api/carreras?activa=true')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].activa).toBe(true);
    });
  });

  describe('GET /api/carreras/:id', () => {
    let carreraId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Test Carrera',
          slug: 'test-carrera',
        });

      carreraId = res.body.data.id;
    });

    it('debería obtener una carrera por ID', async () => {
      const res = await request(app)
        .get(`/api/carreras/${carreraId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(carreraId);
      expect(res.body.data.nombre).toBe('Test Carrera');
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/carreras/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera no existe', async () => {
      const res = await request(app)
        .get('/api/carreras/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/carreras/:id', () => {
    let carreraId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Original',
          slug: 'original',
        });

      carreraId = res.body.data.id;
    });

    it('debería actualizar una carrera', async () => {
      const res = await request(app)
        .put(`/api/carreras/${carreraId}`)
        .send({
          nombre: 'Actualizado',
          descripcion: 'Nueva descripción',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizado');
      expect(res.body.data.descripcion).toBe('Nueva descripción');
    });

    it('debería fallar si el nuevo slug ya existe', async () => {
      await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Otra',
          slug: 'otra',
        });

      const res = await request(app)
        .put(`/api/carreras/${carreraId}`)
        .send({
          slug: 'otra',
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera no existe', async () => {
      const res = await request(app)
        .put('/api/carreras/9999')
        .send({
          nombre: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/carreras/:id', () => {
    let carreraId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/carreras')
        .send({
          nombre: 'Para Eliminar',
          slug: 'para-eliminar',
        });

      carreraId = res.body.data.id;
    });

    it('debería eliminar una carrera', async () => {
      const res = await request(app)
        .delete(`/api/carreras/${carreraId}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      await request(app)
        .get(`/api/carreras/${carreraId}`)
        .expect(404);
    });

    it('debería fallar si la carrera no existe', async () => {
      const res = await request(app)
        .delete('/api/carreras/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
