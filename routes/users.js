const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const protect = require('../middleware/auth');


/* Toutes les routes protégées */
router.use(protect);

/* Routes CRUD */
/* Créer un utilisateur */
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error('Tous les champs sont obligatoires');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    /* Appel depuis un navigateur (dashboard) */
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect(`/dashboard?message=Utilisateur créé (ID : ${user._id})`);

    }

    /* Appel API (tests Jest) */
    res.status(201).json(user);

  } catch (err) {
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
    }
    res.status(400).json({ error: err.message });
  }
});

/* Modifier un utilisateur */
router.put('/', async (req, res) => {
  try {
    const { name, email, newName, newEmail, newPassword } = req.body;

    if (!name && !email) {
      throw new Error('Nom ou email existant requis');
    }

    /* Trouver l'utilisateur existant */
    const user = await User.findOne({
      $or: [
        name ? { name } : null,
        email ? { email } : null
      ].filter(Boolean)
    });

    if (!user) throw new Error('Utilisateur introuvable');

    /* préparer les modifications */
    if (newName) user.name = newName;
    if (newEmail) user.email = newEmail;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard?message=Utilisateur modifié avec succès');
    }

    res.status(200).json(user);

  } catch (err) {
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
    }
    res.status(400).json({ error: err.message });
  }
});


/* Supprimer un utilisateur */
router.delete('/deleteById', async (req, res) => {
  try {
    const id = req.body.id?.trim();
    if (!id) throw new Error('ID utilisateur requis');

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('Utilisateur introuvable');

    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard?message=Utilisateur supprimé');
    }

    res.sendStatus(200);

  } catch (err) {
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
    }
    res.status(400).json({ error: err.message });
  }
});


/* Récupérer tous les utilisateurs */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


module.exports = router;