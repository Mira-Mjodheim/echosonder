const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server/app');
const User = require('../../server/models/User');

afterAll(async () => {
  await mongoose.connection.close();
});

describe('UserController', () => {
  beforeEach(async () => {
    await User.deleteMany({});
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

    it('retourne 404 pour un email inexistant', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'nobody@example.com', password: 'pass',
      });
      expect(res.status).toBe(404);
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
  });
});
