const User = require('../models/User');
const bcrypt = require('bcryptjs');
const catwayService = require('../services/catwayService');

/* Fonction utilitaire pour rendre le dashboard avec catways + messages */
async function renderDashboard(res, user, message = null, error = null) {
  const catways = await catwayService.getAllCatways();
  return res.render('dashboard', { user, catways, message, error });
}

/* Créer un nouvel utilisateur */
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return renderDashboard(res, req.session.user, null, "Nom, email et mot de passe requis");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Redirige vers le dashboard avec un message en query string
    return res.redirect('/dashboard?message=Utilisateur créé avec succès');

  } catch (err) {
    return renderDashboard(res, req.session.user, null, err.message);
  }
};


/* Modifier un utilisateur */
exports.updateUser = async (req, res) => {
  const { name, email, newName, newEmail, newPassword } = req.body;

  if (!name && !email) {
    return renderDashboard(res, req.session.user, null, "Vous devez fournir un nom ou un email pour identifier l'utilisateur");
  }

  try {
    const query = {};
    if (name) query.name = name;
    if (email) query.email = email;

    const updateData = {};
    if (newName) updateData.name = newName;
    if (newEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

    const result = await User.updateOne(query, updateData);

    if (result.matchedCount === 0) {
      return renderDashboard(res, req.session.user, null, "Utilisateur non trouvé");
    }

    return renderDashboard(res, req.session.user, "Utilisateur modifié avec succès");

  } catch (err) {
    return renderDashboard(res, req.session.user, null, err.message);
  }
};

/* Supprimer un utilisateur */
exports.deleteUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return renderDashboard(res, req.session.user, null, "Vous devez fournir un nom ou un email");
  }

  try {
    const query = {};
    if (name) query.name = name;
    if (email) query.email = email;

    const result = await User.deleteOne(query);

    if (result.deletedCount === 0) {
      return renderDashboard(res, req.session.user, null, "Utilisateur non trouvé");
    }

    return renderDashboard(res, req.session.user, "Utilisateur supprimé avec succès");

  } catch (err) {
    return renderDashboard(res, req.session.user, null, "Utilisateur non trouvé ou données manquantes");
  }
};

/* Récupérer tous les utilisateurs (API JSON) */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
