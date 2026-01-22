const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/*Login */
router.post('/login', authController.login);
/*Logout */
router.post('/logout', authController.logout);
/*Inscription */
router.post('/register', authController.register);

module.exports = router;
