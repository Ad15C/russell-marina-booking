const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const protect = require('./middleware/auth');

const catwayService = require('./services/catwayService');
const Reservation = require('./models/Reservation');
const Catway = require('./models/catway');


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


/* Routes publiques */
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});


/* API Authentification */
app.use('/api/auth', authRoutes);

/* Documentation API publique */
app.get('/documentation', async (req, res, next) => {
  try {
    const catways = await Catway.find(); 
    res.render('documentation', { 
      catways, 
      user: req.user || { name: 'Invité' } 
    });
  } catch (err) {
    next(err);
  }
});


/* Affichage du dashboard/routes protégées */
app.get('/dashboard', protect, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    const reservations = await Reservation.find();
    res.render('dashboard', {
      user: req.user,
      catways,
      reservations,
      message: req.query.message || null,
      error: req.query.error || null
    });
  } catch {
    res.status(500).send('Erreur chargement dashboard');
  }
});


/* Routes RESTful et dashboard pour les utilisateurs */
/* API USERS */
app.use('/api/users', protect, userRoutes);



/* DASHBOARD USERS */
app.use('/', authRoutes);
app.use('/api/catways', require('./routes/catwaysAPI'));
app.use('/catways', protect, require('./routes/catwaysDashboard'));
app.use('/api/reservations', require('./routes/reservationsAPI'));
app.use('/reservations', require('./routes/reservationsDashboard'));


/* Gestion des routes non définies */
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});


/* Exporter l'application pour l'utiliser dans d'autres fichiers (comme le serveur) */
module.exports = app;
