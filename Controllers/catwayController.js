const Catway = require('../models/catway');
const catwayService = require('../services/catwayService');
const mongoose = require('mongoose');

/* Dashboard UI */
/* Créer un nouveau catway depuis le dashboard */
exports.createCatwayDashboard = async (req, res) => {
  try {
    const { catwayNumber, type, catwayState, redirectTo } = req.body;
    if (!catwayNumber) throw new Error('Le numéro du catway est requis');
    
    await Catway.create({ catwayNumber, type, catwayState });
    res.redirect((redirectTo || '/dashboard') + '?message=Catway créé avec succès !');
  } catch (err) {
    const redirectTo = req.body?.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
};

/* Mettre à jour un catway depuis le dashboard */
exports.updateCatwayDashboard = async (req, res) => {
  try {
    const id = req.params.id?.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID invalide');
    }

    const { type, catwayState, redirectTo } = req.body;
    await Catway.findByIdAndUpdate(req.params.id, { type, catwayState });
    res.redirect((redirectTo || '/dashboard') + '?message=Catway modifié avec succès !');
  } catch (err) {
    const redirectTo = req.body?.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
};

/* Supprimer un catway depuis le dashboard */
exports.deleteCatwayDashboard = async (req, res) => {
  try {
    const id = req.params.id?.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID invalide');
    }

    const hasReservations = await catwayService.catwayHasReservations(id);
    if (hasReservations) throw new Error('Impossible de supprimer ce catway : des réservations existent');

    const deleted = await catwayService.deleteCatway(id);
    if (!deleted) throw new Error('Catway introuvable');

    const redirectTo = req.body?.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?message=Catway supprimé avec succès');
  } catch (err) {
    const redirectTo = req.body?.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
};




/* API RESTful CRUD pour les catways */
/* Récupérer tous les catways */
exports.getAllCatwaysAPI = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Récupérer un catway par ID */
exports.getCatwayByIdAPI = async (req, res) => {
    try {
        const catway = await catwayService.getCatwayById(req.params.id);
        if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
        res.status(200).json(catway);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* Mettre à jour un catway via API REST */
exports.updateCatwayAPI = async (req, res) => {
  try {
    const catway = await catwayService.updateCatway(req.params.id, req.body);
    if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
    res.status(200).json(catway);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* Supprimer un catway via API REST */
exports.deleteCatwayAPI = async (req, res) => {
  try {
    const catway = await catwayService.deleteCatway(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
    res.status(200).json({ message: 'Catway supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};