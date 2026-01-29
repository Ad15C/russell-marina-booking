const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* Valeur aléatoire ajoutée au mot de passe pour
 le rendre unique et sécuriser le hash.
 10 correspond au nombre de tours de hashage */
const SALT_ROUNDS = 10;

/*Fonction pour l'inscription et hash du mot de passe*/
exports.register = async (name, email, password) => {
  /* Vérifie si l'email est déjà utilisé */ 
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email déjà utilisé');
  /* Crée un nouvel utilisateur */
  const user = await User.create({ name, email, password });
  return user;
};

/*Fonction pour la connexion et retourne un token d'authentification*/
exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Utilisateur non trouvé');

  const isValid = await user.matchPassword(password);
  if (!isValid) throw new Error('Mot de passe incorrect');

  /* Création du token JWT */
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};



