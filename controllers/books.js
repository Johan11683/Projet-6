const Book = require('../models/Books');
const fs = require('fs');

// Fonction pour créer un livre
exports.createBook = (req, res) => {
  let bookObject;

  // Essayer de parser JSON = convertir en format lisible
  try {
    bookObject = JSON.parse(req.body.book);
  } catch (error) {
    return res.status(400).json({ message: 'Format JSON invalide.', error: error.message });
  }

  delete bookObject._id;
  delete bookObject.userId;

  // Vérifie d'abord si un livre avec ce titre existe déjà
  Book.findOne({ title: bookObject.title })
    .then(existingBook => {
      if (existingBook) {
        return res.status(400).json({ message: 'Un livre avec ce titre existe déjà.' });
      }

      // Si pas de livre existant, on crée le nouveau livre
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });

      book.save()
        .then(() => res.status(201).json({ message: 'Livre créé avec succès !' }))
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du livre :', error);
          res.status(500).json({ message: 'Erreur serveur', error: error.message });
        });
    })
    .catch(error => {
      console.error('Erreur lors de la vérification du titre :', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    });
};


// Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
};

// Fonction pour récupérer un livre par ID
exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
};

// Fonction pour modifier un livre
exports.updateBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Nouvelle image
      }
    : { ...req.body };

  // On empêche que quelqu'un modifie l'userId via la requête
  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre' });
      }

      // Si une nouvelle image est envoyée, on supprime l'ancienne image
      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];  // Extraire le nom de l'image actuelle
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'ancienne image', error: err });
          }

          // Mise à jour du livre avec la nouvelle image
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
            .catch(error => res.status(400).json({ error }));
        });
      } else {
        // Si aucune nouvelle image n'est envoyée, on met à jour le livre sans toucher à l'image
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};


// Fonction pour supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
      .then(book => {
          if (!book) {
              return res.status(404).json({ message: 'Livre non trouvé' });
          }

          // Vérifie que l'utilisateur a créé le livre
          if (book.userId !== req.auth.userId) {
              return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce livre' });
          }

          // Supprime le fichier de l'image si elle existe
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              // Après la suppression de l'image, on supprime le livre
              Book.deleteOne({ _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                  .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
          });
      })
      .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
};
