```javascript
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/user');

app.use(express.json());

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB', err));

app.use('/api/contents', contentRoutes);
app.use('/api/users', userRoutes);

const port = config.server.port;
app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`));
```