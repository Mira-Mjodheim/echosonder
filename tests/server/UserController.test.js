const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../../server/app');
const User = require('../../server/models/User');
const Content = require('../../server/models/Content');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const createUser = async (name, email) => {
  const user = await User.create({ name, email, password: 'password123' });
  const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || 'secret-echosonder', { expiresIn: '7d' });
  return { token, id: user._id.toString() };
};

describe('UserController', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Content.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('cree un utilisateur et retourne un token', async () => {
      const res = await request(app).post('/api/users/register').send({
        name: 'Test User', email: 'test@example.com', password: 'password123',
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
    });

    it('retourne 400 pour un email deja utilise', async () => {
      await request(app).post('/api/users/register').send({
        name: 'Existing', email: 'test@example.com', password: 'pass123',
      });
      const res = await request(app).post('/api/users/register').send({
        name: 'New User', email: 'test@example.com', password: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('retourne 400 si name est absent', async () => {
      const res = await request(app).post('/api/users/register').send({
        email: 'test@example.com', password: 'password123',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    it('retourne un token pour identifiants valides', async () => {
      await request(app).post('/api/users/register').send({
        name: 'Login User', email: 'login@example.com', password: 'password123',
      });
      const res = await request(app).post('/api/users/login').send({
        email: 'login@example.com', password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('retourne 401 pour mot de passe incorrect', async () => {
      await request(app).post('/api/users/register').send({
        name: 'Login User', email: 'login@example.com', password: 'password123',
      });
      const res = await request(app).post('/api/users/login').send({
        email: 'login@example.com', password: 'wrong',
      });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('retourne 401 pour un email inexistant', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'nobody@example.com', password: 'pass',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/me', () => {
    it('retourne le profil de utilisateur authentifie', async () => {
      const regRes = await request(app).post('/api/users/register').send({
        name: 'Me User', email: 'me@example.com', password: 'password123',
      });
      const token = regRes.body.token;
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Me User');
      expect(res.body).toHaveProperty('email', 'me@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    it("met a jour les informations d'un utilisateur", async () => {
      const regRes = await request(app).post('/api/users/register').send({
        name: 'Update User', email: 'update@example.com', password: 'password123',
      });
      const { token, user } = regRes.body;
      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Name');
    });

    it('ignore les champs non modifiables comme following, followers ou role', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      const res = await request(app)
        .put(`/api/users/${alice.id}`)
        .set('Authorization', `Bearer ${alice.token}`)
        .send({ name: 'Alice 2', following: [bob.id], followers: [bob.id], role: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Alice 2');
      const aliceDoc = await User.findById(alice.id);
      expect(aliceDoc.following).toHaveLength(0);
      expect(aliceDoc.followers).toHaveLength(0);
      expect(aliceDoc.role).toBe('user');
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app)
        .put('/api/users/000000000000000000000000')
        .send({ name: 'x' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it("supprime un utilisateur", async () => {
      const regRes = await request(app).post('/api/users/register').send({
        name: 'Delete User', email: 'delete@example.com', password: 'password123',
      });
      const { token, user } = regRes.body;
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('retire les relations de suivi de l\'utilisateur supprime', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      await request(app)
        .post(`/api/users/${bob.id}/follow`)
        .set('Authorization', `Bearer ${alice.token}`);

      const res = await request(app)
        .delete(`/api/users/${bob.id}`)
        .set('Authorization', `Bearer ${bob.token}`);
      expect(res.status).toBe(200);

      const aliceDoc = await User.findById(alice.id);
      expect(aliceDoc.following).toHaveLength(0);
    });
  });

  describe('POST /api/users/:id/follow', () => {
    it('ajoute la relation dans following et followers', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');

      const res = await request(app)
        .post(`/api/users/${bob.id}/follow`)
        .set('Authorization', `Bearer ${alice.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Bob');
      expect(res.body).toHaveProperty('followersCount', 1);
      expect(res.body).toHaveProperty('followingCount', 0);
      expect(res.body).not.toHaveProperty('password');

      const aliceDoc = await User.findById(alice.id);
      const bobDoc = await User.findById(bob.id);
      expect(aliceDoc.following.map(String)).toEqual([bob.id]);
      expect(bobDoc.followers.map(String)).toEqual([alice.id]);
    });

    it('ne duplique pas la relation si on suit deux fois', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      await request(app).post(`/api/users/${bob.id}/follow`).set('Authorization', `Bearer ${alice.token}`);
      const res = await request(app)
        .post(`/api/users/${bob.id}/follow`)
        .set('Authorization', `Bearer ${alice.token}`);

      expect(res.status).toBe(200);
      expect(res.body.followersCount).toBe(1);
    });

    it('refuse de se suivre soi-meme', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const res = await request(app)
        .post(`/api/users/${alice.id}/follow`)
        .set('Authorization', `Bearer ${alice.token}`);
      expect(res.status).toBe(400);
    });

    it('retourne 404 pour un utilisateur inexistant', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const res = await request(app)
        .post(`/api/users/${new mongoose.Types.ObjectId()}/follow`)
        .set('Authorization', `Bearer ${alice.token}`);
      expect(res.status).toBe(404);
    });

    it('retourne 400 pour un id invalide', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const res = await request(app)
        .post('/api/users/abc/follow')
        .set('Authorization', `Bearer ${alice.token}`);
      expect(res.status).toBe(400);
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app).post('/api/users/000000000000000000000000/follow');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users/:id/unfollow', () => {
    it('retire la relation des deux tableaux', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      await request(app).post(`/api/users/${bob.id}/follow`).set('Authorization', `Bearer ${alice.token}`);

      const res = await request(app)
        .post(`/api/users/${bob.id}/unfollow`)
        .set('Authorization', `Bearer ${alice.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('followersCount', 0);

      const aliceDoc = await User.findById(alice.id);
      const bobDoc = await User.findById(bob.id);
      expect(aliceDoc.following).toHaveLength(0);
      expect(bobDoc.followers).toHaveLength(0);
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app).post('/api/users/000000000000000000000000/unfollow');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/feed', () => {
    it('retourne uniquement les echos des utilisateurs suivis, du plus recent au plus ancien', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      const carol = await createUser('Carol', 'carol@example.com');
      await request(app).post(`/api/users/${bob.id}/follow`).set('Authorization', `Bearer ${alice.token}`);
      await Content.create([
        { title: 'Bob ancien', userId: bob.id, createdAt: new Date('2026-01-01') },
        { title: 'Bob recent', userId: bob.id, createdAt: new Date('2026-03-01') },
        { title: 'Carol', userId: carol.id, createdAt: new Date('2026-04-01') },
        { title: 'Alice', userId: alice.id, createdAt: new Date('2026-05-01') },
      ]);

      const res = await request(app)
        .get('/api/users/feed')
        .set('Authorization', `Bearer ${alice.token}`);

      expect(res.status).toBe(200);
      expect(res.body.contents.map(c => c.title)).toEqual(['Bob recent', 'Bob ancien']);
      expect(res.body).toMatchObject({ page: 1, limit: 20, total: 2, hasMore: false });
      expect(res.body.contents[0].userId).toMatchObject({ name: 'Bob' });
    });

    it('pagine les resultats avec page et limit', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      await request(app).post(`/api/users/${bob.id}/follow`).set('Authorization', `Bearer ${alice.token}`);
      await Content.create([
        { title: 'Echo 1', userId: bob.id, createdAt: new Date('2026-01-01') },
        { title: 'Echo 2', userId: bob.id, createdAt: new Date('2026-01-02') },
        { title: 'Echo 3', userId: bob.id, createdAt: new Date('2026-01-03') },
      ]);

      const first = await request(app)
        .get('/api/users/feed?page=1&limit=2')
        .set('Authorization', `Bearer ${alice.token}`);
      expect(first.body.contents.map(c => c.title)).toEqual(['Echo 3', 'Echo 2']);
      expect(first.body).toMatchObject({ page: 1, limit: 2, total: 3, hasMore: true });

      const second = await request(app)
        .get('/api/users/feed?page=2&limit=2')
        .set('Authorization', `Bearer ${alice.token}`);
      expect(second.body.contents.map(c => c.title)).toEqual(['Echo 1']);
      expect(second.body).toMatchObject({ page: 2, total: 3, hasMore: false });
    });

    it('retourne un fil vide sans abonnement', async () => {
      const alice = await createUser('Alice', 'alice@example.com');
      const bob = await createUser('Bob', 'bob@example.com');
      await Content.create({ title: 'Bob', userId: bob.id });

      const res = await request(app)
        .get('/api/users/feed')
        .set('Authorization', `Bearer ${alice.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ contents: [], total: 0, hasMore: false });
    });

    it('retourne 401 sans token', async () => {
      const res = await request(app).get('/api/users/feed');
      expect(res.status).toBe(401);
    });
  });
});
