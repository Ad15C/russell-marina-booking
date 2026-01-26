const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  catwayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catway',
    required: true
  },
  catwayNumber: {
    type: Number,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  boatName: {
    type: String,
    required: true
  },
    checkIn: {
        type: Date,
        required: true,
        validate: {
        validator: function(value) {
            // Check-in ne peut pas être dans le passé
            return value >= new Date().setHours(0,0,0,0);
        },
        message: 'La date d\'arrivée ne peut pas être antérieure à aujourd\'hui'
        }
    },
    checkOut: {
        type: Date,
        required: true,
        validate: {
        validator: function(value) {
            // checkOut doit être après checkIn
            return this.checkIn ? value > this.checkIn : true;
        },
        message: 'La date de départ doit être après la date d\arrivée'
        }
    }
});

/* Évite l'erreur OverwriteModelError */
module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
