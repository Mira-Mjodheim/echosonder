require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/echosonder';
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CORS_ORIGIN, methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' }));
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use('/api/contents', require('./routes/content'));
app.use('/api/users',    require('./routes/user'));

if (require.main === module) {
  app.listen(PORT, () => console.log(`EchoSonder démarré sur le port ${PORT}`));
}

module.exports = app;
