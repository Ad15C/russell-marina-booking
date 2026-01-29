const jwt = require('jsonwebtoken');

/* Middleware de protection des routes */
module.exports = (req, res, next) => {
console.log('NODE_ENV DANS AUTH:', process.env.NODE_ENV);

  /* MODE TEST : on bypass TOUTE l'auth */
  if (process.env.NODE_ENV === 'test') {
    req.user = { _id: 'testUserId', name: 'Test User' };
    req.userId = 'testUserId';
    return next();
  }

  /* MODE NORMAL */
  const token = req.session?.token;

  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expirée' });
  }
};
