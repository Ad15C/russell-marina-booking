const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createReservation, getReservationById, deleteReservation } = require('../controllers/reservationController');

/* Protection uniquement hors tests */
if (process.env.NODE_ENV !== 'test') {
  router.use(protect);
}

/* API RESTful */
router.post('/catways/:catwayId/reservations', createReservation); /* Créer une nouvelle réservation */
router.get('/catways/:catwayId/reservations/:reservationId', getReservationById); /* Récupérer une réservation par ID */
router.delete('/catways/:catwayId/reservations/:reservationId', deleteReservation); /* Supprimer une réservation par ID */

module.exports = router;
