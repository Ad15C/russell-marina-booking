const reservationService = require('../services/reservationService');
const Reservation = require('../models/Reservation');
const Catway = require('../models/catway');
const mongoose = require('mongoose');


/* Validation d'une réservation via le service */
async function validateReservation(data, reservationId = null) {
  return reservationService.validateReservation({ ...data, excludeId: reservationId });
}


/* API RESTful */
/* Créer une réservation via API JSON */
async function createReservation(req, res) {
    /* Détecte si le client veut une réponse JSON */
    const wantsJSON = req.headers.accept?.includes('application/json') || process.env.NODE_ENV === 'test';

  try {
    const reservation = await reservationService.createReservation(req.body);
    /* Réponse JSON pour API */
    if (wantsJSON) {
      return res.status(201).json(reservation);
    }

    /* Dashboard HTML */
    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?message=Réservation créée avec succès !');
  } catch (err) {
    if (wantsJSON) return res.status(500).json({ error: err.message });

    const redirectTo = req.body.redirectTo || '/dashboard';
    res.redirect(redirectTo + '?error=' + encodeURIComponent(err.message));
  }
}


/* Récupérer une réservation par ID */
async function getReservationById(req, res, next) {
    /* Détecte si le client veut une réponse JSON */
   const wantsJSON = req.headers.accept?.includes('application/json') || process.env.NODE_ENV === 'test';

  try {
    const { reservationId } = req.params;
    let reservation = await reservationService.getReservationById(reservationId);

    if (!reservation) {
      if (wantsJSON) return res.status(404).json({ error: 'Réservation introuvable' });
      return res.redirect('/dashboard?error=Réservation introuvable');
    }

    /* Peupler catwayId pour le dashboard */
    if (!wantsJSON && reservation.catwayId && typeof reservation.catwayId !== 'string') {
      await reservation.populate('catwayId');
    }

    /* Réponse JSON pour API */
    if (wantsJSON) {
      return res.status(200).json(reservation.toObject());
    }
    /* Dashboard HTML */
    res.render('reservation', { reservation, user: req.user });
  } catch (err) {
    console.error('Erreur getReservationById:', err.message);
    if (wantsJSON) return res.status(500).json({ error: err.message });
    next(err);
  }
}

/* Supprimer une réservation via API REST */
async function deleteReservation(req, res, next) {
    /* Détecte si le client veut une réponse JSON */
const wantsJSON = req.headers.accept?.includes('application/json') || process.env.NODE_ENV === 'test';

  try {
    const { reservationId } = req.params;
    const deleted = await reservationService.deleteReservation(reservationId);

    if (!deleted) {
      if (wantsJSON) return res.status(404).json({ error: 'Réservation introuvable' });
      return res.redirect('/dashboard?error=Réservation introuvable');
    }
    /* Réponse JSON pour API */
    if (wantsJSON) return res.status(200).json({ message: 'Réservation supprimée avec succès' });
    /* Dashboard HTML */
    res.redirect('/dashboard?message=Réservation supprimée !');
  } catch (err) {
    console.error('Erreur deleteReservation:', err.message);
    if (wantsJSON) return res.status(500).json({ error: err.message });
    next(err);
  }
}

/* Dashboard UI - HTML forms */
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
      return res.redirect("/dashboard?error=Réservation introuvable");
    }

    res.redirect("/dashboard?message=Réservation supprimée !");
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
