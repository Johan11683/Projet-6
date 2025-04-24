const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userCtrl = require('../controllers/user');

// Routes d'inscription et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Route pour récupérer tous les utilisateurs (ADMIN)
router.get('/', (req, res) => {
    User.find()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json({ error }));
});
  
// Route pour récupérer un utilisateur par son ID
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(error => res.status(404).json({ error: 'Utilisateur non trouvé' }));
});

module.exports = router;
