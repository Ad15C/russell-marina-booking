const Catway = require('../models/catway');
const catwayService = require('../services/catwayService');


/* Dashboard UI */
/* Créer un nouveau catway depuis le dashboard */
exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, type, catwayState } = req.body;
    if (!catwayNumber) throw new Error('Le numéro du catway est requis');
    
    await Catway.create({ catwayNumber, type, catwayState });
    res.redirect('/dashboard?message=Catway créé avec succès !');
  } catch (err) {
    res.redirect(
      '/dashboard?error=' +
        encodeURIComponent('Erreur lors de la création du catway : ' + err.message)
    );
  }
};

/* Mettre à jour un catway depuis le dashboard */
exports.updateCatwayDashboard = async (req, res) => {
  try {
    const { type, catwayState } = req.body;
    await Catway.findByIdAndUpdate(req.params.id, { type, catwayState });
    res.redirect('/dashboard?message=Catway modifié avec succès !');
  } catch (err) {
    res.redirect(
      '/dashboard?error=' +
        encodeURIComponent('Erreur lors de la modification : ' + err.message)
    );
  }
};

/* Supprimer un catway depuis le dashboard */
exports.deleteCatway = async (req, res) => {
  try {
    const { id } = req.params;

    /* Vérifier les réservations existantes */
    const hasReservations = await catwayService.catwayHasReservations(id);
    if (hasReservations) {
      return res.redirect(
        '/catways?error=' +
          encodeURIComponent('Impossible de supprimer ce catway : des réservations existent')
      );
    }

    /* Supprimer le catway */
    const deleted = await catwayService.deleteCatway(id);
    if (!deleted) {
      return res.redirect('/catways?error=Catway introuvable');
    }

    res.redirect('/catways?message=Catway supprimé avec succès');
  } catch (err) {
    res.redirect('/catways?error=' + encodeURIComponent(err.message));
  }
};


/* API RESTful CRUD pour les catways */
/* Récupérer tous les catways */
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.status(200).json({
      success: true,
      message: 'Liste des catways récupérée avec succès',
      data: catways,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catways',
      error: err.message,
    });
  }
};

/* Récupérer un catway par ID */
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway)
      return res.status(404).json({ success: false, message: 'Catway introuvable' });

    res.status(200).json({
      success: true,
      message: 'Catway récupéré avec succès',
      data: catway,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'ID de catway invalide',
      error: err.message,
    });
  }
};

/* Mettre à jour un catway via API REST */
exports.updateCatwayAPI = async (req, res) => {
  try {
    const catway = await catwayService.updateCatway(req.params.id, req.body);
    if (!catway) return res.status(404).json({ success: false, message: 'Catway introuvable' });

    res.status(200).json({ success: true, message: 'Catway mis à jour avec succès', data: catway });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du catway',
      error: err.message,
    });
  }
};

/* Supprimer un catway via API REST */
exports.deleteCatwayAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await catwayService.deleteCatway(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Catway introuvable' });

    res.status(200).json({ success: true, message: 'Catway supprimé avec succès' });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la suppression du catway',
      error: err.message,
    });
  }
};