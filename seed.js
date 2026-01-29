const mongoose = require('mongoose');
const path = require('path');
const Reservation = require('./models/Reservation');
const Catway = require('./models/Catway');

/* Charger les variables d'environnement */
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config({ path: './env/.env.dev' });
}

/* Connection à MongoDB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB :', err));

/* Lire les fichiers JSON */
const catwaysData = require(path.join(__dirname, 'data', 'catways-valid.json'));
const reservationsData = require(path.join(__dirname, 'data', 'reservations.json'));

async function seed() {
  try {
    /* Vider les collections */
    await Catway.deleteMany({});
    console.log("Collections Catway vidées ✅");

    await Reservation.deleteMany({});
    console.log("Collections Reservation vidées ✅");

    /* Insérer les catways */
    const insertedCatways = await Catway.insertMany(catwaysData);
    console.log("Catways importés ✅");

    /* Générer les réservations avec dates valides */
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Début de journée

    const reservationsWithIds = reservationsData.map((r, i) => {
      const catway = insertedCatways.find(c => c.catwayNumber === r.catwayNumber);
      if (!catway) throw new Error(`Catway ${r.catwayNumber} introuvable pour ${r.clientName}`);

      // Décaler chaque réservation pour éviter chevauchement
      const checkIn = new Date(today);
      checkIn.setDate(checkIn.getDate() + i);         // +i jours
      const checkOut = new Date(checkIn);
      checkOut.setHours(checkOut.getHours() + 2);    // durée 2h

      return {
        ...r,
        catwayId: catway._id,
        checkIn,
        checkOut
      };
    });

    /* Insérer les réservations */
    await Reservation.insertMany(reservationsWithIds);
    console.log("Réservations importées ");

    console.log('Données importées avec succès ');
  } catch (err) {
    console.error('Erreur lors de l\'import :', err);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB déconnecté ');
  }
}

seed();
