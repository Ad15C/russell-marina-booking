const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { renderDashboard } = require('./dashboardController');

/* Créer un utilisateur (UI) */
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return renderDashboard(req, res, null, 'Tous les champs sont obligatoires');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect(`/dashboard?message=Utilisateur créé (ID : ${user._id})`);
  } catch (err) {
    renderDashboard(req, res, null, err.message);
  }
};

/* Modifier un utilisateur (UI) */
exports.updateUser = async (req, res) => {
  const { name, email, newName, newEmail, newPassword } = req.body;

  if (!name && !email) {
    return renderDashboard(
      req,
      res,
      null,
      "Nom ou email requis pour identifier l'utilisateur"
    );
  }

  try {
    const query = {};
    if (name) query.name = name;
    if (email) query.email = email;

    const updateData = {};
    if (newName) updateData.name = newName;
    if (newEmail) updateData.email = newEmail;
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const result = await User.updateOne(query, updateData);

    if (result.matchedCount === 0) {
      return renderDashboard(req, res, null, 'Utilisateur non trouvé');
    }

    renderDashboard(req, res, 'Utilisateur modifié avec succès');
  } catch (err) {
    renderDashboard(req, res, null, err.message);
  }
};

/* Supprimer un utilisateur (UI) */
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.redirect('/dashboard?error=ID utilisateur requis');
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.redirect('/dashboard?error=Utilisateur introuvable');
    }

    res.redirect('/dashboard?message=Utilisateur supprimé');
  } catch (err) {
    res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
  }
};

/* API JSON */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
