const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const protect = require('../middleware/auth');
const Catway = require('../models/Catway');

router.use(protect);

/* Dashboard UI */
router.post('/', catwayController.createCatwayDashboard); /* créer depuis dashboard */
router.put('/:id', catwayController.updateCatwayDashboard); /* modifier depuis dashboard */
router.delete('/:id', catwayController.deleteCatwayDashboard); /* supprimer depuis dashboard */

/* Afficher la liste des catways dans le dashboard */
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render('catways', { 
      catways, 
      user: req.user, 
      message: null,  
      error: null     
    });
  } catch (err) {
    res.redirect('/dashboard?error=Impossible de charger la liste des catways');
  }
});

/* Afficher les détails d'un catway */
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.redirect('/dashboard?error=Catway introuvable');

    res.render('catway', {
      catway,
      user: req.user,
      message: null,
      error: null
    });
  } catch (err) {
    res.redirect('/dashboard?error=Erreur lors de l\'affichage du catway');
  }
});

module.exports = router;