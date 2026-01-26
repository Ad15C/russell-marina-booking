const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/* Récupérer toutes les réservations d'un catway */
async function getAllReservations(req, res) {
  try {
    const { catwayId } = req.params;

    // Vérifier que le catway existe
    const catway = await Catway.findById(catwayId);
    if (!catway) {
      return res.status(404).json({ success: false, message: 'Le catway est introuvable' });
    }

    const reservations = await Reservation.find({ catwayId });
    res.status(200).json({ success: true, message: 'Liste des réservations récupérée avec succès', data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/* Récupérer une réservation précise */
async function getReservationById(req, res) {
  try {
    const { catwayId, reservationId } = req.params;

    const reservation = await Reservation.findOne({ _id: reservationId, catwayId });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'La réservation est introuvable' });
    }

    res.status(200).json({ success: true, message: 'Réservation récupérée avec succès', data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: 'ID invalide', error: err.message });
  }
}

/* Créer une réservation pour un catway */
async function createReservation(req, res) {
  try {
    const { catwayId } = req.params;
    const { clientName, boatName, checkIn, checkOut } = req.body;

    /* Vérifier que le catway existe */
    const catway = await Catway.findById(catwayId);
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: 'Le catway est introuvable'
      });
    }

     /* Validation des dates */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'La date de début ne peut pas être antérieure à aujourd’hui'
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être postérieure à la date de début'
      });
    }

    /* Créer la réservation */
    const reservation = await Reservation.create({
      catwayId,
      catwayNumber: catway.catwayNumber, 
      clientName,
      boatName,
      checkIn,
      checkOut
    });

    res.status(201).json({ success: true, message: 'Réservation ajoutée avec succès !', data: reservation });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Erreur lors de la création', error: err.message });
  }
}

/* Supprimer une réservation */
async function deleteReservation(req, res) {
  try {
    const { catwayId, reservationId } = req.params;

    const reservation = await Reservation.findOneAndDelete({ _id: reservationId, catwayId });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'La réservation est introuvable' });
    }

    res.status(200).json({ success: true, message: 'La réservation a bien été supprimée' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Erreur lors de la suppression', error: err.message });
  }
}

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  deleteReservation
};
