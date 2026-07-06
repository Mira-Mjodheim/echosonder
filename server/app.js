require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/echosonder';
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes' },
});
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Defer MongoDB connection so tests can use mongodb-memory-server
const connectDb = () => {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));
};

app.use('/api/contents', require('./routes/content'));
app.use('/api/users',    require('./routes/user'));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: 'Erreur interne du serveur' });
});

if (require.main === module) {
  connectDb();
  app.listen(PORT, () => console.log(`EchoSonder démarré sur le port ${PORT}`));
}

module.exports = { app, connectDb };
