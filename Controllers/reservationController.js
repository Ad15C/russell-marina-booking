const reservationService = require('../services/reservationService');

/* Validation d'une réservation via le service */
async function validateReservation(data, reservationId = null) {
  return reservationService.validateReservation({ ...data, excludeId: reservationId });
}


/* API RESTful */
/* Créer une réservation via API JSON */
async function createReservation(req, res) {
  try {
    await reservationService.createReservation(req.body);
    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?message=Réservation créée avec succès !');
  } catch (err) {
    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
}


/* Récupérer une réservation par ID */
async function getReservationById(req, res, next) {
  try {
    const { reservationId } = req.params;
    const reservation = await reservationService.getReservationById(reservationId)
      .populate('catwayId'); 

    if (!reservation) {
      return res.status(404).send('Réservation introuvable');
    }

    res.render('reservation', { reservation, user: req.user });
  } catch (err) {
    next(err);
  }
}

/* Supprimer une réservation via API REST */
async function deleteReservation(req, res, next) {
  try {
    const { reservationId } = req.params;
    const deleted = await reservationService.deleteReservation(reservationId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    }

    res.status(200).json({ success: true, message: 'Réservation supprimée avec succès' });
  } catch (err) {
    next(err);
  }
}

/* Dashboard UI */
/* Créer une réservation depuis le dashboard (HTML form) */
async function createReservationFromDashboard(req, res, next) {
  try {
    await reservationService.createReservation(req.body);
    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?message=Réservation créée avec succès !');
 } catch (err) {
    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
}

/* Supprimer une réservation depuis le dashboard (HTML form) */
async function deleteReservationFromDashboard(req, res, next) {
  try {
    const { reservationId } = req.params;
    const deleted = await reservationService.deleteReservation(reservationId);

    if (!deleted) {
      return res.redirect('/dashboard?error=Réservation introuvable');
    }

    res.redirect('/dashboard?message=Réservation supprimée !');
  } catch (err) {
    next(err);
  }
}

/* Exporter toutes les fonctions */
module.exports = {
  validateReservation,
  createReservation,
  getReservationById,
  deleteReservation,                /* API REST */
  createReservationFromDashboard,   /* Dashboard HTML */
  deleteReservationFromDashboard    /* Dashboard HTML */
};
