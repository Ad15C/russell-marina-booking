const mongoose = require('mongoose');

const CatwaySchema = new mongoose.Schema({
  catwayNumber: String,
  type: String,
  catwayState: String
});

/* Évite l'erreur OverwriteModelError */
module.exports = mongoose.models.Catway || mongoose.model('Catway', CatwaySchema);