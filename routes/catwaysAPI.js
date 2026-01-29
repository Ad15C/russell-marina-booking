const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const protect = require('../middleware/auth');

/* Protection uniquement hors tests */
if (process.env.NODE_ENV !== 'test') {
  router.use(protect);
}

/* API REST */
router.get('/', catwayController.getAllCatwaysAPI); /* GET /catways */
router.get('/:id', catwayController.getCatwayByIdAPI); /* GET /catways/:id */
router.post('/', catwayController.createCatwayDashboard); /* POST /catways */
router.put('/:id', catwayController.updateCatwayAPI); /* PUT /catways/:id */
router.delete('/:id', catwayController.deleteCatwayAPI); /* DELETE /catways/:id */

module.exports = router;
