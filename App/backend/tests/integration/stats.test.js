import { describe, it, expect, beforeEach, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { sequelize } from '../../src/models/index.js';
import { createAndLogin } from '../helpers/helpers.js';

describe('Stats Endpoints', () => {
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

    // Crear carreras y materias para las estadísticas
    await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Desarrollo de Software',
        slug: 'desarrollo-software',
        activa: true,
      });

    await request(app)
      .post('/api/carreras')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Análisis de Sistemas',
        slug: 'analisis-sistemas',
        activa: true,
      });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/stats/dashboard', () => {
    it('debería obtener estadísticas del dashboard (admin)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
      expect(res.body.data.materias).toBeDefined();
      expect(res.body.data.staff).toBeDefined();
      expect(res.body.data.carreras).toBeGreaterThanOrEqual(0);
      expect(res.body.data.staff).toBeGreaterThanOrEqual(1); // Al menos el admin
    });

    it('debería contar carreras activas', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.carreras).toBeGreaterThanOrEqual(2);
    });

    it('debería contar staff (admin + profesor + tutor)', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.staff).toBeGreaterThanOrEqual(3);
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería obtener estadísticas con token de profesor', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
    });

    it('debería obtener estadísticas con token de tutor', async () => {
      const res = await request(app)
        .get('/api/stats/dashboard')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.carreras).toBeDefined();
    });
  });

  describe('GET /api/stats/recent-activity', () => {
    beforeEach(async () => {
      // Crear datos de prueba para actividad reciente

      // Noticia publicada
      await request(app)
        .post('/api/noticias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          titulo: 'Última noticia de prueba',
          slug: 'ultima-noticia-prueba',
          contenido: 'Contenido de prueba',
          estado: 'publicado',
          fecha_publicacion: new Date().toISOString(),
        });

      // Evento
      await request(app)
        .post('/api/eventos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Último evento de prueba',
          descripcion: 'Descripción del evento',
          fecha: new Date(Date.now() + 86400000).toISOString(),
          ubicacion: 'Aula 1',
          estado: 'confirmado',
        });

      // Consulta
      await request(app)
        .post('/api/consultas')
        .send({
          nombre: 'Juan Consulta',
          email: 'juan@test.com',
          asunto: 'Última consulta de prueba',
          mensaje: 'Mensaje de prueba',
        });

      // Testimonio
      await request(app)
        .post('/api/testimonios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          autor_nombre: 'María Testimonio',
          autor_carrera: 'Desarrollo de Software',
          texto: 'Excelente institución',
          visible: true,
        });
    });

    it('debería obtener actividad reciente (admin)', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('debería retornar items con estructura correcta', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const item = res.body.data[0];
      expect(item).toHaveProperty('tipo');
      expect(item).toHaveProperty('texto');
      expect(item).toHaveProperty('timestamp');
      expect(item).toHaveProperty('id');
    });

    it('debería incluir al menos una noticia publicada', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const noticias = res.body.data.filter((a) => a.tipo === 'noticia');
      expect(noticias.length).toBeGreaterThanOrEqual(1);
    });

    it('debería incluir al menos un evento', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const eventos = res.body.data.filter((a) => a.tipo === 'evento');
      expect(eventos.length).toBeGreaterThanOrEqual(1);
    });

    it('debería incluir al menos una consulta', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const consultas = res.body.data.filter((a) => a.tipo === 'consulta');
      expect(consultas.length).toBeGreaterThanOrEqual(1);
    });

    it('debería incluir al menos un testimonio', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const testimonios = res.body.data.filter((a) => a.tipo === 'testimonio');
      expect(testimonios.length).toBeGreaterThanOrEqual(1);
    });

    it('debería incluir al menos un usuario activo', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const usuarios = res.body.data.filter((a) => a.tipo === 'usuario');
      expect(usuarios.length).toBeGreaterThanOrEqual(1);
    });

    it('debería retornar máximo 10 items', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(10);
    });

    it('debería ordenar por timestamp descendente', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      if (res.body.data.length >= 2) {
        const first = new Date(res.body.data[0].timestamp);
        const second = new Date(res.body.data[1].timestamp);
        expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
      }
    });

    it('debería fallar sin token', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de profesor', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${profesorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('debería fallar con token de tutor', async () => {
      const res = await request(app)
        .get('/api/stats/recent-activity')
        .set('Authorization', `Bearer ${tutorToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
