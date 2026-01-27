const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const protect = require('../middleware/auth');


/* Toutes les routes protégées */
router.use(protect);

/* Routes CRUD */
/* Créer un utilisateur */
router.post('/', userController.createUser);

/* Modifier un utilisateur */
router.put('/', userController.updateUser);

/* Supprimer un utilisateur */
router.delete('/deleteById', userController.deleteUserById);


/* Récupérer tous les utilisateurs */
router.get('/', userController.getAllUsers);


module.exports = router;