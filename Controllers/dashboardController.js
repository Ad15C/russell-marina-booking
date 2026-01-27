const catwayService = require('../services/catwayService');
const Reservation = require('../models/Reservation');

exports.renderDashboard = async (req, res, message = null, error = null) => {
  try {
    const catways = await catwayService.getAllCatways();
    const reservations = await Reservation.find();

    res.render('dashboard', {
      user: req.session.user,
      catways,
      reservations,
      message,
      error
    });
  } catch (err) {
    res.status(500).send('Erreur chargement dashboard');
  }
};
