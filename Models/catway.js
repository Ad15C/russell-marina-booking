const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: true,
    unique: true /* chaque pont doit avoir un numéro unique */
  },
  type: {
    type: String,
    required: true,
    enum: ['long', 'short'], /* seulement ces deux valeurs possibles */
  },
  catwayState: {
    type: String,
    required: true,
    enum: ['libre', 'occupé', 'en maintenance'], /* état limité à ces valeurs */
    default: 'libre'
  }
}, {
  timestamps: true /* ajoute createdAt et updatedAt automatiquement */
});

/* Évite l'erreur OverwriteModelError */
module.exports = mongoose.models.Catway || mongoose.model('Catway', CatwaySchema);
