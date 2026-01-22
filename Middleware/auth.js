const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  /*récupère le token dans le cookie de session */
  const token = req.session?.token;
  console.log('Pas de token en session');
  if (!token) return res.redirect('/');

  try {
    /* Vérifie que le JWT est correct */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* On stocke l'ID utilisateur dans la requête */
    req.userId = decoded.id;

    next();
  } catch (err) {
    /* Token invalide ou expiré */
    req.session = null; /* supprime le cookie */
    console.log(' Token invalide ou expiré');
    res.redirect('/');
  }
};
