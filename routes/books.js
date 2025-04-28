const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const ratingCtrl = require('../controllers/rating');

// D'abord la route pour récupérer les livres les mieux notés
router.get('/bestrating', ratingCtrl.getBestRatedBooks); // Route pour les livres les mieux notés

// Routes CRUD sur les livres
router.post('/', auth, multer, bookCtrl.createBook); // Protéger post
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.updateBook);  // Protéger update
router.delete('/:id', auth, bookCtrl.deleteBook);  // Protéger delete

// Ajout de note
router.post('/:id/rating', auth, ratingCtrl.addRating); // Route pour ajouter une note à un livre

module.exports = router;
