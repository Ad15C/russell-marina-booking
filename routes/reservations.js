const express = require('express');
const router = express.Router();
const { getAllReservations, getReservationById, createReservation, deleteReservation } = require('../controllers/reservationController');
const protect = require('../middleware/auth');

/* Toutes les routes CRUD pour les réservations */
router.use(protect);

/* Liste des réservations pour un catway (JSON) */
router.get('/catways/:catwayId/reservations', getAllReservations);

/* Détail d’une réservation */
router.get('/catways/:catwayId/reservations/:reservationId', getReservationById);

/* Créer une réservation */
router.post('/catways/:catwayId/reservations', createReservation);

/* Supprimer une réservation */
router.delete('/catways/:catwayId/reservations/:reservationId', deleteReservation);

module.exports = router;