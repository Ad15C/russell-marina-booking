const express = require('express');
const router = express.Router();
const { getAllReservations, getReservationById, createReservation, deleteReservation } = require('../controllers/reservationController');
const protect = require('../middleware/auth');

/* Toutes les routes CRUD pour les réservations */
router.use(protect);

router.get('/catways/:catwayId/reservations', getAllReservations); /* Liste des réservations pour un catway */
router.get('/catways/:catwayId/reservations/:reservationId', getReservationById);/* Détail d’une réservation */
router.post('/catways/:catwayId/reservations', createReservation);/* Créer une réservation */
router.delete('/catways/:catwayId/reservations/:reservationId', deleteReservation);/* Supprimer une réservation */

module.exports = router;