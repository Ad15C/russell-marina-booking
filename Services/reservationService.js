const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');

/* Tutes les réservations */
exports.getAllReservations = () => {
  return Reservation.find();
};

/* Réservations d’un catway */
exports.getReservationsByCatway = (catwayId) => {
  return Reservation.find({ catwayId });
};

/* Détail d’une réservation */
exports.getReservationById = (reservationId) => {
  return Reservation.findById(reservationId);
};

/* Créer une réservation */
exports.createReservation = (data) => {
  return Reservation.create(data);
};

/* Supprimer une réservation */
exports.deleteReservation = (reservationId) => {
  return Reservation.findByIdAndDelete(reservationId);
};
