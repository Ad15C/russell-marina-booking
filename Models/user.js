const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
  type: String, 
  required: true,
  minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
}
});

/* Hook pour hasher le mot de passe avant de sauvegarder */
userSchema.pre('save', async function() {
  /* Si le mot de passe n'est pas modifié, on passe */
  if (!this.isModified('password')) return;
/* Hashage du mot de passe */
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* Méthode pour comparer un mot de passe lors de la connexion */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



/* Méthode pour comparer un mot de passe lors de la connexion */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/* Évite l'erreur OverwriteModelError */
module.exports = mongoose.models.User || mongoose.model('User', userSchema);

