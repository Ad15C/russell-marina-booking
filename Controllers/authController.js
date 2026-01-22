const authService = require('../services/authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* Inscription d'un nouvel utilisateur */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    /* Crée l'utilisateur */
    const user = await authService.register(name, email, password);

    /* Connecte automatiquement l'utilisateur après inscription */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    req.session.token = token;
    req.session.user = { id: user._id, name: user.name, email: user.email };

    /* Redirige vers le dashboard */
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

    req.session.token = token;
    req.session.user = { id: user._id, name: user.name, email: user.email };

    /* Redirige vers le dashboard */
    res.redirect('/dashboard');
  } catch (err) {
    /* Affiche le message d'erreur sur la page de login */
    res.status(401).render('login', { error: err.message });
  }
};


/* Déconnexion de l'utilisateur */
exports.logout = (req, res) => {
  /* Supprime la session */
  req.session = null;
  /* Redirige vers la page de login */
  res.redirect('/');
};
