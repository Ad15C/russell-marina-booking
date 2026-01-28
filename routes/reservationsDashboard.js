const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createReservationFromDashboard, deleteReservationFromDashboard } = require('../controllers/reservationController');

router.use(protect);

/* Création d'une réservation depuis le dashboard */
router.post('/', createReservationFromDashboard);

/* Supprimer une réservation depuis le dashboard */
/* on utilise POST + /delete pour éviter les problèmes avec method-override */
router.post('/:reservationId/delete', deleteReservationFromDashboard);

module.exports = router;
