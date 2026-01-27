const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catwayController');
const protect = require('../middleware/auth');

router.use(protect);

/* API REST */
router.get('/', catwayController.getAllCatways); /* GET /catways */
router.get('/:id', catwayController.getCatwayById); /* GET /catways/:id */
router.post('/', catwayController.createCatway); /* POST /catways */
router.put('/:id', catwayController.updateCatwayAPI); /* PUT /catways/:id */
router.delete('/:id', catwayController.deleteCatwayAPI); /* DELETE /catways/:id */

module.exports = router;
