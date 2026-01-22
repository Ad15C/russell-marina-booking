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

const protect = require('./middleware/auth');


const app = express();

/* Middleware globaux */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method; // supprime le champ pour éviter conflit
    return method;
  }
}));


/* Configuration des sessions avec cookies */
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 60 * 60 * 1000
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
app.get('/dashboard', protect, (req, res) => {
  res.render('dashboard', {
    user: req.session.user,
    message: req.query.message,
    error: req.query.error
  });
});


/* Routes API Utilisateurs */
app.use('/api/users', userRoutes);

/* Export App*/
module.exports = app;
