const authService = require('../services/authService');
const User = require('../models/User');

/* Inscription d'un nouvel utilisateur */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await authService.register(name, email, password);

    /* Redirige vers le dashboard après inscription*/
    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).render('register', { error: err.message });
  }
};

/* Connexion d'un utilisateur existant */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    const user = await User.findOne({ email });

    /* Stockage du token JWT dans le cookie */
    req.session.token = token;

    /* Stockage des infos utilisateur pour l'affichage */
    req.session.user = { id: user._id, name: user.name, email: user.email };

    res.redirect('/dashboard');
  } catch (err) {
    res.status(401).render('login', { error: err.message });
  }
};

/* Déconnexion de l'utilisateur */
exports.logout = (req, res) => {
  /*Supprime le cookie de session */
  req.session = null;
  res.redirect('/');
};
