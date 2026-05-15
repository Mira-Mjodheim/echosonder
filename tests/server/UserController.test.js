```javascript
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('UserController', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/users/register').send(user);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('devrait retourner une erreur pour un utilisateur existant', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const response = await request(app).post('/api/users/register').send(user);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    it('devrait retourner un token pour un utilisateur existant', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const response = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('devrait retourner une erreur pour des informations d\'identification incorrectes', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/users/me', () => {
    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const response = await request(app).get('/api/users/me').set("Authorization", `Bearer ${user._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('email');
    });

    it('devrait retourner une erreur pour un token invalide', async () => {
      const response = await request(app).get('/api/users/me').set("Authorization", 'Bearer invalidtoken');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PATCH /api/users/me', () => {
    it('devrait mettre à jour les informations de l\'utilisateur connecté', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const response = await request(app).patch('/api/users/me').set("Authorization", `Bearer ${user._id}`).send({
        username: 'newusername',
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'newusername');
    });

    it('devrait retourner une erreur pour un token invalide', async () => {
      const response = await request(app).patch('/api/users/me').set("Authorization", 'Bearer invalidtoken').send({
        username: 'newusername',
      });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('devrait supprimer l\'utilisateur connecté', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();

      const response = await request(app).delete('/api/users/me').set("Authorization", `Bearer ${user._id}`);
      expect(response.status).toBe(200);
    });

    it('devrait retourner une erreur pour un token invalide', async () => {
      const response = await request(app).delete('/api/users/me').set("Authorization", 'Bearer invalidtoken');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
```