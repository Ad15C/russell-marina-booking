const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const reservationService = require('../services/reservationService');

/* Validation d'une réservation via le service */
async function validateReservation(data, reservationId = null) {
  return reservationService.validateReservation({ ...data, excludeId: reservationId });
}

/* Récupérer toutes les réservations d’un catway */
async function getAllReservations(req, res) {
  try {
    const { catwayId } = req.params;
    const reservations = await reservationService.getReservationsByCatway(catwayId);
    res.status(200).json({ success: true, message: 'Liste des réservations récupérée', data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/* Récupérer une réservation par ID */
async function getReservationById(req, res) {
  try {
    const { catwayId, reservationId } = req.params;
    const reservation = await reservationService.getReservationById(reservationId);

    if (!reservation || reservation.catwayId.toString() !== catwayId) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable' });
    }

    res.status(200).json({ success: true, message: 'Réservation récupérée', data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: 'ID invalide', error: err.message });
  }
}

/* Création d’une réservation via API JSON */
async function createReservation(req, res) {
  try {
    const { catway, checkInDate, checkOutDate } = await validateReservation(req.body);

    const reservation = await reservationService.createReservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });

    res.status(201).json({ success: true, message: 'Réservation créée', data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

/* Création d’une réservation depuis le dashboard (UI) */
async function createReservationFromDashboard(req, res) {
  try {
    const { catway, checkInDate, checkOutDate } = await validateReservation(req.body);

    await reservationService.createReservation({
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });

    res.redirect('/dashboard?message=Réservation créée avec succès !');
  } catch (err) {
    res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
  }
}

/* Mise à jour d'une réservation */
async function updateReservation(req, res) {
  try {
    const { reservationId } = req.params;
    const { catway, checkInDate, checkOutDate } = await validateReservation(req.body, reservationId);

    const updated = await reservationService.updateReservation(reservationId, {
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });

    if (!updated) return res.status(404).json({ success: false, message: 'Réservation introuvable' });

    res.status(200).json({ success: true, message: 'Réservation mise à jour', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

/* Supprimer une réservation */
async function deleteReservation(req, res) {
  try {
    const { reservationId } = req.params;

    const deleted = await reservationService.deleteReservation(reservationId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Réservation introuvable' });

    res.status(200).json({ success: true, message: 'Réservation supprimée avec succès' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

/* Exports */
module.exports = {
  validateReservation,
  getAllReservations,
  getReservationById,
  createReservation,
  createReservationFromDashboard,
  updateReservation,
  deleteReservation
};