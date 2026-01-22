const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');

/* Routes CRUD pour les catways */

/* Récupérer tous les catways */
router.get('/', catwayController.getAllCatways);
/* Récupérer un catway par ID */
router.get('/:id', catwayController.getCatwayById);
/* Créer un nouveau catway */
router.post('/', catwayController.createCatway);
/* Mettre à jour un catway */
router.put('/:id', catwayController.updateCatway);
/* Supprimer un catway */
router.delete('/:id', catwayController.deleteCatway);

module.exports = router;
