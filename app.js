const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const catwayService = require('./services/catwayService');
const Reservation = require('./models/Reservation');
const Catway = require('./models/catway');

const protect = require('./middleware/auth');

const app = express();


/* Middlewares globaux */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Support des méthodes PUT et DELETE via des formulaires HTML */
app.use(methodOverride((req, res) => {
  if (req.body && req.body._method) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

/* Configuration des sessions avec cookies */
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}));


/* Configuration du moteur de vues EJS */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Connexion à MongoDB */
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/catway_db')
  .then(() => console.log(' MongoDB connecté'))
  .catch(err => console.error('MongoDB error:', err));


/* Routes publiques */
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});


/* API Authentification */
app.use('/api/auth', authRoutes);


/* Affichage du dashboard protégé */
app.get('/dashboard', protect, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    const reservations = await Reservation.find();

    res.render('dashboard', {
      user: req.session.user,
      catways,
      reservations,
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch {
    res.status(500).send('Erreur chargement dashboard');
  }
});


/* API USERS (REST) */
app.use('/api/users', protect, userRoutes);


/* Routes catways */
app.use('/catways', protect, require('./routes/catwaysDashboard'));
app.use('/api/catways', protect, require('./routes/catwaysAPI'));


/* Liste des catways */
app.get('/catways', protect, async (req, res) => {
  const catways = await catwayService.getAllCatways();
  res.render('catways', {
    user: req.session.user,
    catways,
    message: req.query.message || null,
    error: req.query.error || null
  });
});

app.get('/catways/:id', protect, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway) return res.status(404).send('Catway introuvable');

    res.render('catway', {
      user: req.session.user,
      catway,
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch {
    res.status(400).send('ID invalide');
  }
});


/* Toutes les routes /api/reservations sont protégées */
app.use('/api/reservations', require('./routes/reservationsAPI'));
app.use('/reservations-dashboard', require('./routes/reservationsDashboard'));


/* Liste des réservations */
app.get('/reservations', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('catwayId');
    const catways = await Catway.find();

    res.render('reservations', {
      user: req.session.user,
      reservations,
      catways,
      message: null,
      error: null
    });
  } catch (err) {
    res.redirect('/dashboard?error=' + encodeURIComponent(err.message));
  }
});

app.get('/catways/:id/reservations', protect, async (req, res) => {
  const catway = await Catway.findById(req.params.id);
  if (!catway) return res.redirect('/dashboard');

  const reservations = await Reservation.find({ catwayId: catway._id });
  const catways = await Catway.find();

  res.render('reservations', {
    user: req.session.user,
    reservations,
    catway,
    catways,
    message: null,
    error: null
  });
});

app.get('/reservations/:reservationId', protect, async (req, res) => {
  const reservation = await Reservation
    .findById(req.params.reservationId)
    .populate('catwayId');

  if (!reservation) {
    return res.redirect('/reservations?error=Introuvable');
  }

  res.render('reservation', {
    user: req.session.user,
    reservation
  });
});




app.get('/catways/:catwayId/reservations/:reservationId', protect, async (req, res) => {
  const reservation = await Reservation.findById(req.params.reservationId);
  if (!reservation) {
    return res.redirect(`/catways/${req.params.catwayId}/reservations`);
  }

  res.render('reservation', {
    user: req.session.user,
    reservation,
    message: null,
    error: null
  });
});

/* Gestion des routes non définies */
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});


/* Exporter l'application pour l'utiliser dans d'autres fichiers (comme le serveur) */
module.exports = app;
