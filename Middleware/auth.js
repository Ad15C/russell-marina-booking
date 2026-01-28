const jwt = require('jsonwebtoken');

/**
 * Middleware de protection des routes */
module.exports = (req, res, next) => {
  /* Récupération du token dans le cookie de session */
  const token = req.session?.token;

  /* Pas de token */
  if (!token) {
    console.log('Pas de token en session');

    /* Si appel API → JSON */
    if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié"
      });
    }

    /* Sinon navigateur */
    return res.redirect('/');
  }

  try {
    /* Vérification du token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token invalide ou expiré');
    /* Supprime la session */
    req.session = null;
  /* Si appel API → JSON */
    if (req.originalUrl.startsWith('/api') || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({
        success: false,
        message: "Session expirée"
      });
    }

    res.redirect('/');
  }
};

