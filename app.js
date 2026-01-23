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

/* Routes EJS pour afficher les pages côté serveur */
/* Liste de tous les catways (vue) */
app.get('/catways', protect, async (req, res) => {
  const catways = await catwayService.getAllCatways();
  res.render('catways', { 
    user: req.session.user, 
    catways 
  });
});

/* Détail d’un catway */
app.get('/catways/:id', protect, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayById(req.params.id);
    if (!catway) return res.status(404).send('Catway introuvable');
    res.render('catway', { catway, user: req.session.user });
  } catch (err) {
    res.status(400).send('ID invalide');
  }
});

/* Page 404 si aucune route ne correspond */
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});


/* Export App*/
module.exports = app;
