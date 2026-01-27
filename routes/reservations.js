const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

const {
  createReservation,
  createReservationFromDashboard,
  getReservationById,
  deleteReservation
} = require('../controllers/reservationController');

router.use(protect);

/* API */
router.post('/catways/:catwayId/reservations', createReservation);
router.get('/catways/:catwayId/reservations/:reservationId', getReservationById);
router.delete('/catways/:catwayId/reservations/:reservationId', deleteReservation);

/* Dashboard */
router.post('/from-dashboard', createReservationFromDashboard);

module.exports = router;
