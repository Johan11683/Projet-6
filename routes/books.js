const express = require('express');
const router = express.Router();
const Book = require('../models/Books');

// // Route test
// router.get('/', (req, res) => {
//     res.send('Server is running!');
//   });


// POST : créer un livre
router.post('/', (req, res) => {
    const book = new Book({
      ...req.body
    });
  
    // Essayer de sauvegarder et log l'erreur si ça échoue
    book.save()
      .then(() => {
        res.status(201).json({ message: 'Livre enregistré !' });
      })
      .catch(error => {
        console.error('Erreur lors de la création du livre:', error);
        if (error.name === 'ValidationError') {
          return res.status(400).json({ message: 'Données invalides', error: error.message });
        }
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
      });
  });
  

// GET : tous les livres
router.get('/', (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

// GET : un livre par ID
router.get('/:id', (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

// PUT : modifier un livre
router.put('/:id', (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

// DELETE : supprimer un livre
router.delete('/:id', (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;
