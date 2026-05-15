const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const Content = require('../../server/models/Content');

const FAKE_USER_ID = new mongoose.Types.ObjectId();

describe('ContentController', () => {
  beforeEach(async () => {
    await Content.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/contents', () => {
    it('retourne une liste vide par défaut', async () => {
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it('retourne les échos existants', async () => {
      await Content.create({ title: 'Écho 1', type: 'audio', userId: FAKE_USER_ID });
      await Content.create({ title: 'Écho 2', type: 'ambient', userId: FAKE_USER_ID });
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/contents/:id', () => {
    it('retourne un écho par son ID', async () => {
      const echo = await Content.create({ title: 'Écho test', type: 'vocal', userId: FAKE_USER_ID });
      const res = await request(app).get(`/api/contents/${echo._id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Écho test');
    });

    it('retourne 400 pour un ID invalide', async () => {
      const res = await request(app).get('/api/contents/invalid-id');
      expect(res.status).toBe(400);
    });

    it('retourne 404 si l\'écho n\'existe pas', async () => {
      const res = await request(app).get(`/api/contents/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/contents', () => {
    it('crée un écho (sans auth, userId auto)', async () => {
      const res = await request(app).post('/api/contents').send({
        title: 'Nouvel écho',
        description: 'Une description',
        type: 'audio',
        mood: 'calme'
      });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Nouvel écho');
    });

    it('retourne 400 si title est absent', async () => {
      const res = await request(app).post('/api/contents').send({ type: 'audio' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/contents/:id', () => {
    it('met à jour un écho', async () => {
      const echo = await Content.create({ title: 'Avant', type: 'audio', userId: FAKE_USER_ID });
      const res = await request(app).put(`/api/contents/${echo._id}`).send({ title: 'Après' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Après');
    });

    it('retourne 404 si l\'écho n\'existe pas', async () => {
      const res = await request(app).put(`/api/contents/${new mongoose.Types.ObjectId()}`).send({ title: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/contents/:id', () => {
    it('supprime un écho', async () => {
      const echo = await Content.create({ title: 'À supprimer', type: 'audio', userId: FAKE_USER_ID });
      const res = await request(app).delete(`/api/contents/${echo._id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/supprimé/);
    });

    it('retourne 404 si l\'écho n\'existe pas', async () => {
      const res = await request(app).delete(`/api/contents/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });
});
