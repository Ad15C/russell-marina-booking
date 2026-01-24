const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const methodOverride = require('method-override');


const authRoutes = require('./routes/auth');
const authController = require('./controllers/authController');
const userRoutes = require('./routes/users');
const catwaysRoutes = require('./routes/catways'); 
const catwayService = require('./services/catwayService');
const reservationsRoutes = require('./routes/reservations');
const reservationService = require('./services/reservationService');

const protect = require('./middleware/auth');


const app = express();

/* Middleware globaux */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method; /* supprime le champ pour éviter conflit*/
    return method;
  }
}));


/* Configuration des sessions avec cookies */
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET], /* clé secrète */
  maxAge: 60 * 60 * 1000,            /* 1 heure */
  httpOnly: true,                     /* JS côté client ne peut pas lire */
  secure: process.env.NODE_ENV === 'production', /* HTTPS seulement en prod */
  sameSite: 'strict'                  /* protège contre CSRF */
}));

console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

/* Configuration moteur de template EJS */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Connexion MongoDB */
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/catway_db')
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error(err));


/* Routes */

/* Routes publiques  login et register */
app.get('/', (req, res) => res.render('login', { error: null }));
app.get('/register', (req, res) => res.render('register', { error: null }));

/* Routes API Auth */
app.use('/api/auth', authRoutes);


/* Routes privées */

/* Dashboard protégé */
app.get('/dashboard', protect, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.render('dashboard', {
      user: req.session.user,
      catways,
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch (err) {
    res.status(500).send('Erreur lors du chargement du dashboard');
  }
});


/* Routes API Utilisateurs */
app.use('/api/users',protect, userRoutes);

/* Routes API Catways protégées (REST JSON) */
app.use('/api/catways', protect, catwaysRoutes);

/* Liste de tous les catways */
app.get('/catways', protect, async (req, res) => {
  const catways = await catwayService.getAllCatways();
  res.render('catways', {
    user: req.session.user,
    catways,
    message: req.query.message || null,
    error: req.query.error || null
  });
});

/* Détail d’un catway */
app.get('/catways/:id', protect, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway) return res.status(404).send('Catway introuvable');
    res.render('catway', {
      catway,
      user: req.session.user,
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch {
    res.status(400).send('ID invalide');
  }
});

/* Créer un catway */
app.post('/catways', protect, async (req, res) => {
  try {
    await catwayService.createCatway(req.body);
    res.redirect('/catways?message=Catway créé');
  } catch (err) {
    res.redirect('/catways?error=' + encodeURIComponent(err.message));
  }
});

/* Modifier un catway */
app.put('/catways/:id', protect, async (req, res) => {
  try {
    const updateData = {};
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.catwayState) updateData.catwayState = req.body.catwayState;
    await catwayService.updateCatway(req.params.id, updateData);
    res.redirect('/catways?message=Catway modifié');
  } catch (err) {
    res.redirect('/catways?error=' + encodeURIComponent(err.message));
  }
});

/* Supprimer un catway */
app.delete('/catways/:id', protect, async (req, res) => {
  try {
    await catwayService.deleteCatway(req.params.id);
    res.redirect('/catways?message=Catway supprimé');
  } catch (err) {
    res.redirect('/catways?error=' + encodeURIComponent(err.message));
  }
});

/* Modifier un catway depuis formulaire par ID */
app.post('/catways/updateById', protect, async (req, res) => {
  try {
    const { id, type, catwayState } = req.body;
    const updateData = {};
    if (type) updateData.type = type;
    if (catwayState) updateData.catwayState = catwayState;

    await catwayService.updateCatway(id, updateData);
    res.redirect('/dashboard?message=Catway modifié');
  } catch (err) {
    res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
  }
});

/* Supprimer un catway depuis formulaire par ID */
app.post('/catways/deleteById', protect, async (req, res) => {
  try {
    const { id } = req.body;
    await catwayService.deleteCatway(id);
    res.redirect('/dashboard?message=Catway supprimé');
  } catch (err) {
    res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
  }
});

/* Réservation Routes */
/* Routes pour les réservations */
app.use('/api/reservations', protect, reservationsRoutes);

/*Détail d’une réservation */
app.get('/catways/:id/reservations/:reservationId', protect, async (req, res) => {
  const reservation = await Reservation.findById(req.params.reservationId);

  res.render('reservation', {
    reservation,
    user: req.user
  });
});

/*Créer une réservation pour un catway */
app.post('/catways/:id/reservations', protect, async (req, res) => {
  const catway = await Catway.findById(req.params.id);

  await Reservation.create({
    catwayId: catway._id,
    catwayNumber: catway.catwayNumber,
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut
  });

  res.redirect(`/catways/${req.params.id}/reservations`);
});

/* Supprimer une réservation */
app.delete('/catways/:id/reservations/:reservationId', protect, async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.reservationId);

  res.redirect(`/catways/${req.params.id}/reservations`);
});


/* Page 404 si aucune route ne correspond */
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});


/* Export App*/
module.exports = app;
