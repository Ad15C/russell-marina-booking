const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const protect = require('../middleware/auth');

/* Toutes les routes protégées */
router.use(protect);


/* Routes CRUD */
/* Récupérer tous les utilisateurs */
router.get('/', usersController.getAllUsers); 
/* Modifier utilisateur */
router.put('/', usersController.updateUser);  
/* Supprimer utilisateur */
router.delete('/', usersController.deleteUser);

module.exports = router;