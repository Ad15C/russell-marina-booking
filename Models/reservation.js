// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayId: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway', required: true },
  catwayNumber: { type: Number, required: true },
  clientName: { type: String, required: true, trim: true },
  boatName: { type: String, required: true, trim: true },
  checkIn: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: "La date d'arrivée ne peut pas être antérieure à aujourd'hui"
    }
  },
  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return this.checkIn ? value > this.checkIn : true;
      },
      message: "La date de départ doit être après la date d'arrivée"
    }
  },
  status: { type: String, enum: ['confirmée', 'annulée'], default: 'confirmée' }
}, { timestamps: true });

/* Pré-sauvegarde : vérifie chevauchement */
reservationSchema.pre('save', async function() {
  const Reservation = mongoose.model('Reservation', reservationSchema);

  const overlapping = await Reservation.findOne({
    catwayId: this.catwayId,
    _id: { $ne: this._id },
    $or: [
      { checkIn: { $lt: this.checkOut }, checkOut: { $gt: this.checkIn } }
    ]
  });

  if (overlapping) {
    throw new Error('Ce catway est déjà réservé sur ces dates');
  }
});


module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
