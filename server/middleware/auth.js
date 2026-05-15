const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Accès non autorisé — token manquant' });
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret-echosonder');
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
