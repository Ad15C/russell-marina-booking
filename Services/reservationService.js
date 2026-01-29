const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/* Validation complète d'une réservation et chevauchements */
async function validateReservation({ catwayId, clientName, boatName, checkIn, checkOut, excludeId = null }) {
  /* Vérifie que le catway existe */
    const catway = await Catway.findById(catwayId);
  if (!catway) throw new Error('Catway introuvable');
  /* Vérifie que le catway est disponible */
  if (catway.catwayState === 'occupé') throw new Error('Ce catway est actuellement occupé');
  if (catway.catwayState === 'maintenance') throw new Error('Ce catway est en maintenance...');

/* Vérifie les champs obligatoires */
  if (!clientName || !boatName || !checkIn || !checkOut) {
    throw new Error('Tous les champs sont obligatoires');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  /* Prépare les dates */
  if (checkInDate < today) throw new Error("La date d'arrivée ne peut pas être passée");
  if (checkOutDate <= checkInDate) throw new Error("La date de départ doit être après la date d'arrivée");

  /* Vérifie chevauchement des réservations */
  const overlappingQuery = { catwayId, $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }] };
  if (excludeId) overlappingQuery._id = { $ne: excludeId };
  
  const overlapping = await Reservation.findOne(overlappingQuery);
  if (overlapping) throw new Error('Ce catway est déjà réservé sur ces dates');

  return { catway, checkInDate, checkOutDate };
}

/* Récupérer toutes les réservations */
async function getAllReservations() {
  return Reservation.find();
}

/* Récupérer les réservations d’un catway */
async function getReservationsByCatway(catwayId) {
  return Reservation.find({ catwayId });
}

/* Récupérer une réservation par ID */
async function getReservationById(reservationId) {
  if (!mongoose.Types.ObjectId.isValid(reservationId)) return null;
  return Reservation.findById(reservationId);
}

/* Créer une réservation */
async function createReservation(data) {
  const { catway, checkInDate, checkOutDate } = await validateReservation(data);

  return Reservation.create({
    catwayId: catway._id,
    catwayNumber: catway.catwayNumber,
    clientName: data.clientName,
    boatName: data.boatName,
    checkIn: checkInDate,
    checkOut: checkOutDate
  });
}

/* Mettre à jour une réservation */
async function updateReservation(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const { catway, checkInDate, checkOutDate } = await validateReservation({ ...data, excludeId: id });

  return Reservation.findByIdAndUpdate(
    id,
    {
      catwayId: catway._id,
      catwayNumber: catway.catwayNumber,
      clientName: data.clientName,
      boatName: data.boatName,
      checkIn: checkInDate,
      checkOut: checkOutDate
    },
    { new: true, runValidators: true }
  );
}

/* Supprimer une réservation */
async function deleteReservation(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Reservation.findByIdAndDelete(id);
}

module.exports = {
  validateReservation,
  getAllReservations,
  getReservationsByCatway,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
