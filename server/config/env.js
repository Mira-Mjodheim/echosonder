```javascript
const dotenv = require('dotenv');

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/echosonder',
  JWT_SECRET: process.env.JWT_SECRET || 'secret-echosonder',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_METHODS: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
  CORS_HEADERS: process.env.CORS_HEADERS || 'Content-Type, Authorization',
};

module.exports = env;
```