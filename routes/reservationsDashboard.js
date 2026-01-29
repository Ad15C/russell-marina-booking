const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');
const { createReservationFromDashboard, deleteReservationFromDashboard } = require('../controllers/reservationController');

router.use(protect);

/* Création d'une réservation depuis le dashboard */
router.post('/', createReservationFromDashboard);

/* Supprimer une réservation depuis le dashboard */
/* on utilise POST + /delete pour éviter les problèmes avec method-override */
router.post('/:reservationId/delete', deleteReservationFromDashboard);


/* Afficher le dashboard avec la liste des réservations et catways */
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('catwayId');
    const catways = await Catway.find();
    res.render('reservations', {
      reservations, 
      catways, 
      user: req.user,
      message: null,
      error: null
    });
  } catch (err) {
    res.redirect("/dashboard?error=Impossible de charger les réservations");
  }
});

/* Afficher les détails d'une réservation */
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('catwayId');
    if (!reservation) return res.redirect("/dashboard?error=Réservation introuvable");
    res.render('reservation', { reservation, user: req.user });
  } catch (err) {
    res.redirect("/dashboard?error=Erreur lors de l'affichage de la réservation");
  }
});
module.exports = router;
