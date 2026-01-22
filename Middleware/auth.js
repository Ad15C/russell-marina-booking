const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  /*récupère le token dans le cookie de session */
  const token = req.session?.token;
  if (!token) {
    console.log('Pas de token en session', req.session);
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('Token invalide ou expiré', err.message);
    req.session = null;
    res.redirect('/');
  }
};
