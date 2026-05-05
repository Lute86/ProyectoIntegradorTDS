import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';

describe('Materia Endpoints', () => {
  let carreraId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    
    // Create a carrera for testing
    const carreraRes = await request(app)
      .post('/api/carreras')
      .send({
        nombre: 'Desarrollo de Software',
        slug: 'desarrollo-de-software',
      });
    
    carreraId = carreraRes.body.data.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/materias', () => {
    it('debería crear una materia con datos válidos', async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Programación I',
          carrera_id: carreraId,
          cuatrimestre: 1,
          carga_horaria_semanal: 8,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Programación I');
      expect(res.body.data.carrera_id).toBe(carreraId);
    });

    it('debería fallar si falta el nombre', async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          carrera_id: carreraId,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('debería fallar si falta carrera_id', async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Test',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la carrera no existe', async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Test',
          carrera_id: 9999,
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/materias', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Materia 1',
          carrera_id: carreraId,
          cuatrimestre: 1,
        });

      await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Materia 2',
          carrera_id: carreraId,
          cuatrimestre: 2,
        });
    });

    it('debería obtener todas las materias', async () => {
      const res = await request(app)
        .get('/api/materias')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('debería filtrar por carrera_id', async () => {
      const res = await request(app)
        .get(`/api/materias?carrera_id=${carreraId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].carrera).toBeDefined();
    });

    it('debería filtrar por cuatrimestre', async () => {
      const res = await request(app)
        .get('/api/materias?cuatrimestre=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].cuatrimestre).toBe(1);
    });
  });

  describe('GET /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Test Materia',
          carrera_id: carreraId,
        });

      materiaId = res.body.data.id;
    });

    it('debería obtener una materia por ID', async () => {
      const res = await request(app)
        .get(`/api/materias/${materiaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(materiaId);
      expect(res.body.data.nombre).toBe('Test Materia');
      expect(res.body.data.carrera).toBeDefined();
    });

    it('debería fallar con ID inválido', async () => {
      const res = await request(app)
        .get('/api/materias/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .get('/api/materias/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Original',
          carrera_id: carreraId,
        });

      materiaId = res.body.data.id;
    });

    it('debería actualizar una materia', async () => {
      const res = await request(app)
        .put(`/api/materias/${materiaId}`)
        .send({
          nombre: 'Actualizada',
          cuatrimestre: 3,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nombre).toBe('Actualizada');
      expect(res.body.data.cuatrimestre).toBe(3);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .put('/api/materias/9999')
        .send({
          nombre: 'Test',
        })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar si se asigna una carrera inexistente', async () => {
      const res = await request(app)
        .put(`/api/materias/${materiaId}`)
        .send({
          carrera_id: 9999,
        })
        .expect(409);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/materias/:id', () => {
    let materiaId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/materias')
        .send({
          nombre: 'Para Eliminar',
          carrera_id: carreraId,
        });

      materiaId = res.body.data.id;
    });

    it('debería eliminar una materia', async () => {
      const res = await request(app)
        .delete(`/api/materias/${materiaId}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      await request(app)
        .get(`/api/materias/${materiaId}`)
        .expect(404);
    });

    it('debería fallar si la materia no existe', async () => {
      const res = await request(app)
        .delete('/api/materias/9999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
