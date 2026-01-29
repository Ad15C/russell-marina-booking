/* charge l'env variables depuis le fichier .env */
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config({ path: './env/.env.dev' });
}

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
  })
  .catch(err => console.error('Erreur MongoDB :', err));
