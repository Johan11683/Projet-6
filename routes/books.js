const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');

// Routes CRUD sur les livres
router.post('/', auth, bookCtrl.createBook); // Protéger post
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.updateBook);  // Protéger update
router.delete('/:id', auth, bookCtrl.deleteBook);  // Protéger delete

module.exports = router;
