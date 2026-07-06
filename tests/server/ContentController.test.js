const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Lazy-load app after mongoose is connected
const getApp = () => {
  // Clear the require cache to get a fresh app with the connected mongoose
  delete require.cache[require.resolve('../../server/app')];
  return require('../../server/app');
};

const Content = require('../../server/models/Content');
const User = require('../../server/models/User');

let authToken = '';

beforeEach(async () => {
  await User.deleteMany({});
  const app = getApp();
  const reg = await request(app).post('/api/users/register').send({
    name: 'Test Author', email: 'author@example.com', password: 'pass1234',
  });
  authToken = reg.body.token;
  await Content.deleteMany({});
});

describe('ContentController', () => {
  describe('GET /api/contents', () => {
    it('retourne une liste vide par defaut', async () => {
      const app = getApp();
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('retourne la liste des echos', async () => {
      const app = getApp();
      await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Echo', type: 'audio' });
      const res = await request(app).get('/api/contents');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('Test Echo');
    });
  });

  describe('GET /api/contents/:id', () => {
    it('retourne 404 pour un id inexistant', async () => {
      const app = getApp();
      const res = await request(app).get(`/api/contents/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/contents', () => {
    it('crée un echo', async () => {
      const app = getApp();
      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Mon Echo', description: 'Desc', type: 'audio' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Mon Echo');
    });

    it('rejette sans titre', async () => {
      const app = getApp();
      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: 'audio' });
      expect(res.status).toBe(400);
    });

    it('rejette sans token', async () => {
      const app = getApp();
      const res = await request(app)
        .post('/api/contents')
        .send({ title: 'Test', type: 'audio' });
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/contents/:id', () => {
    it('rejette si l\'echo n\'appartient pas à l\'utilisateur', async () => {
      const app = getApp();
      const res1 = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Mon Echo', type: 'audio' });
      // Register another user
      const reg2 = await request(app).post('/api/users/register').send({
        name: 'Other', email: 'other@example.com', password: 'pass1234',
      });
      const res2 = await request(app)
        .put(`/api/contents/${res1.body._id}`)
        .set('Authorization', `Bearer ${reg2.body.token}`)
        .send({ title: 'Hacked' });
      expect(res2.status).toBe(403);
    });
  });

  describe('DELETE /api/contents/:id', () => {
    it('supprime son propre echo', async () => {
      const app = getApp();
      const res = await request(app)
        .post('/api/contents')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'A supprimer', type: 'audio' });
      const delRes = await request(app)
        .delete(`/api/contents/${res.body._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(delRes.status).toBe(200);
    });
  });
});
