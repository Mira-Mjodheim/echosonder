const env = require('./env');

const config = {
  env,
  server: {
    port: env.PORT || 3001,
    host: env.HOST || 'localhost',
  },
  database: {
    uri: env.DB_URI || 'mongodb://localhost:27017/echosonder',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: env.JWT_SECRET || 'secret',
    expiresIn: env.JWT_EXPIRES_IN || '1h',
  },
  cors: {
    origin: env.CORS_ORIGIN || '*',
    methods: env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: env.CORS_CREDENTIALS || true,
  },
};

module.exports = config;