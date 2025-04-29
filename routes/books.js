const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharpMiddleware = require('../middleware/sharp');
const ratingCtrl = require('../controllers/rating');

// D'abord la route pour récupérer les livres les mieux notés
router.get('/bestrating', ratingCtrl.getBestRatedBooks); 
// Routes CRUD sur les livres
router.post('/', auth, multer, sharpMiddleware, bookCtrl.createBook); // Protéger post
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, sharpMiddleware, bookCtrl.updateBook);  // Protéger update
router.delete('/:id', auth, bookCtrl.deleteBook);  // Protéger delete

// Ajout de note
router.post('/:id/rating', auth, ratingCtrl.addRating);

module.exports = router;
