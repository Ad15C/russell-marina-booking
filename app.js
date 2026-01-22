const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');
const authController = require('./controllers/authController');


const app = express();

/* Middleware globaux */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 60 * 60 * 1000
}));

console.log('SESSION_SECRET:', process.env.SESSION_SECRET);

/* Config moteur de template EJS */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Connexion MongoDB */
mongoose.connect(process.env.MONGO_URI)
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
  res.render('dashboard', { user: req.session.user });
});

/* Export App*/
module.exports = app;
