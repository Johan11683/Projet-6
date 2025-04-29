const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userCtrl = require('../controllers/user');

// Routes d'inscription et de connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
