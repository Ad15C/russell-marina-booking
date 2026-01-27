const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const protect = require('../middleware/auth');

router.use(protect);

/* Dashboard UI */
router.post('/', catwayController.createCatway);/* créer depuis dashboard */
router.put('/:id', catwayController.updateCatwayDashboard); /* modifier depuis dashboard */
router.delete('/:id', catwayController.deleteCatway); /* supprimer depuis dashboard */

module.exports = router;