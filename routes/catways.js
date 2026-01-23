const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const protect = require('../middleware/auth');

/* Toutes les routes sont protégées par protect */
router.use(protect);


/* Routes CRUD pour les catways */
router.get('/', catwayController.getAllCatways);      /* GET /catways */
router.get('/:id', catwayController.getCatwayById);   /* GET /catways/:id */
router.post('/', catwayController.createCatway);      /* POST /catways */
router.put('/:id', catwayController.updateCatway);    /* PUT /catways/:id */
router.delete('/:id', catwayController.deleteCatway); /* DELETE /catways/:id */

module.exports = router;
