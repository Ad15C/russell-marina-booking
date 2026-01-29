const authService = require('../services/authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* Inscription d'un nouvel utilisateur */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render('register', { error: 'Tous les champs sont obligatoires' });
    }

    if (password.length < 8) {
      return res.status(400).render('register', { error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    /* Création de l'utilisateur (hash dans authService) */
    const user = await authService.register(name, email, password);

    /* Création du token JWT */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session.token = token;
    req.session.user = { id: user._id, name: user.name, email: user.email };

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

    console.log('Session après login :', req.session);
    /* Redirige vers le dashboard */
    res.redirect("/dashboard");
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
