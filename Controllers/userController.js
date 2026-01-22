const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  const { name, email, newName, newEmail, newPassword } = req.body;

  if (!name && !email) {
    return res.render('dashboard', { user: req.session.user, message: null, error: 'Vous devez fournir un nom ou un email pour identifier l\'tilisateur' });
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
      return res.render('dashboard', { user: req.session.user, message: null, error: 'Utilisateur non trouvé' });
    }

    res.render('dashboard', { user: req.session.user, message: 'Utilisateur modifié avec succès', error: null });

  } catch (err) {
    res.render('dashboard', { user: req.session.user, message: null, error: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res.render('dashboard', { user: req.session.user, message: null, error: 'Vous devez fournir un nom ou un email' });
  }

  try {
    const query = {};
    if (name) query.name = name;
    if (email) query.email = email;

    const result = await User.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.render('dashboard', { user: req.session.user, message: null, error: 'Utilisateur non trouvé' });
    }

    res.render('dashboard', { user: req.session.user, message: 'Utilisateur supprimé avec succès', error: null });

  } catch (err) {
    res.render('dashboard', { user: req.session.user, message: null, error: 'Utilisateur non trouvé ou données manquantes' });
  }
};


/* Récupérer tous les utilisateurs */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();    
    res.status(200).json(users);
    } catch (err) {
    res.status(400).send(err.message);
    }
};

