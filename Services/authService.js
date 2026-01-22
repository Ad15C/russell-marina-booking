const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* Valeur aléatoire ajoutée au mot de passe pour
 le rendre unique et sécuriser le hash.
 10 correspond au nombre de tours de hashage */
const SALT_ROUNDS = 10;

/*Fonction pour l'inscription et hash du mot de passe*/
exports.register = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return User.create({ name, email, password: hashedPassword });
};

/*Fonction pour la connexion et retourne un token d'authentification*/
exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Utilisateur non trouvé');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Mot de passe incorrect');

  /*Création d'un JWT */
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};



