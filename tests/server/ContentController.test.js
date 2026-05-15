const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const Content = require('../../server/models/Content');
const User = require('../../server/models/User');

const FAKE_USER_ID = new mongoose.Types.ObjectId();
let authToken = '';

beforeAll(async () => {
  await User.deleteMany({});
  const reg = await request(app).post('/api/users/register').send({
    name: 'Test Author', email: 'author@example.com', password: 'pass1234',
  });
  authToken = reg.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('ContentController', () => {
  beforeEach(async () => {
    await Content.deleteMany({});
  });

  describe('GET /api/contents', () => {
    it('retourne une liste vide par defaut', async () => {
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('retourne les echos existants', async () => {
      await Content.create({ title: 'Echo 1', type: 'audio', userId: FAKE_USER_ID });
      await Content.create({ title: 'Echo 2', type: 'ambient', userId: FAKE_USER_ID });
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/contents/:id', () => {
    it('retourne un echo par son ID', async () => {
      const echo = await Content.create({ title: 'Echo test', type: 'vocal', userId: FAKE_USER_ID });
      const res = await request(app).get(`/api/contents/${echo._id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Echo test');
    });

    it('retourne 400 pour un ID invalide', async () => {
      const res = await request(app).get('/api/contents/invalid-id');
      expect(res.status).toBe(400);
    });

    it("retourne 404 si l'echo n'existe pas", async () => {
      const res = await request(app).get(`/api/contents/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/contents', () => {
    it('cree un echo (avec auth)', async () => {
      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Nouvel echo', description: 'Une description', type: 'audio', mood: 'calme' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Nouvel echo');
    });

    it('retourne 400 si title est absent', async () => {
      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'audio' });
      expect(res.status).toBe(400);
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app).post('/api/contents').send({ title: 'Test', type: 'audio' });
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/contents/:id', () => {
    it('met a jour un echo', async () => {
      const echo = await Content.create({ title: 'Avant', type: 'audio', userId: FAKE_USER_ID });
      const res = await request(app)
        .put(`/api/contents/${echo._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Apres' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Apres');
    });

    it("retourne 404 si l'echo n'existe pas", async () => {
      const res = await request(app)
        .put(`/api/contents/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/contents/:id', () => {
    it('supprime un echo', async () => {
      const echo = await Content.create({ title: 'A supprimer', type: 'audio', userId: FAKE_USER_ID });
      const res = await request(app)
        .delete(`/api/contents/${echo._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/supprim/);
    });

    it("retourne 404 si l'echo n'existe pas", async () => {
      const res = await request(app)
        .delete(`/api/contents/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });
});
