```javascript
const request = require('supertest');
const ContentController = require('../../server/controllers/ContentController');
const Content = require('../../server/models/Content');
const app = require('../../server/app');

describe('ContentController', () => {
  beforeEach(async () => {
    await Content.deleteMany({});
  });

  describe('getContents', () => {
    it('devrait retourner une liste de contenus', async () => {
      const content1 = new Content({ title: 'Contenu 1', text: 'Texte du contenu 1' });
      const content2 = new Content({ title: 'Contenu 2', text: 'Texte du contenu 2' });
      await content1.save();
      await content2.save();

      const response = await request(app).get('/api/contents');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('getContent', () => {
    it('devrait retourner un contenu par son ID', async () => {
      const content = new Content({ title: 'Contenu 1', text: 'Texte du contenu 1' });
      await content.save();

      const response = await request(app).get(`/api/contents/${content._id}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Contenu 1');
    });

    it('devrait retourner un code 404 si le contenu n existe pas', async () => {
      const response = await request(app).get('/api/contents/1234567890');
      expect(response.status).toBe(404);
    });
  });

  describe('createContent', () => {
    it('devrait créer un nouveau contenu', async () => {
      const response = await request(app).post('/api/contents').send({ title: 'Contenu 1', text: 'Texte du contenu 1' });
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Contenu 1');
    });

    it('devrait retourner un code 400 si les données sont invalides', async () => {
      const response = await request(app).post('/api/contents').send({ title: '', text: 'Texte du contenu 1' });
      expect(response.status).toBe(400);
    });
  });

  describe('updateContent', () => {
    it('devrait mettre à jour un contenu', async () => {
      const content = new Content({ title: 'Contenu 1', text: 'Texte du contenu 1' });
      await content.save();

      const response = await request(app).put(`/api/contents/${content._id}`).send({ title: 'Contenu mis à jour' });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Contenu mis à jour');
    });

    it('devrait retourner un code 404 si le contenu n existe pas', async () => {
      const response = await request(app).put('/api/contents/1234567890').send({ title: 'Contenu mis à jour' });
      expect(response.status).toBe(404);
    });
  });

  describe('deleteContent', () => {
    it('devrait supprimer un contenu', async () => {
      const content = new Content({ title: 'Contenu 1', text: 'Texte du contenu 1' });
      await content.save();

      const response = await request(app).delete(`/api/contents/${content._id}`);
      expect(response.status).toBe(204);
    });

    it('devrait retourner un code 404 si le contenu n existe pas', async () => {
      const response = await request(app).delete('/api/contents/1234567890');
      expect(response.status).toBe(404);
    });
  });
});
```