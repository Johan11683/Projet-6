const Book = require('../models/Books');
const fs = require('fs'); // fs est un package Node qui permet de modifier le système des fichiers, notamment de les supprimer (l'image)

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
  delete bookObject.userId; // on protège l'id qui ne peut pas être modifié via le front

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
  // Vérifie si on reçoit une nouvelle image ou pas
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  delete bookObject._userId; // On empêche que quelqu’un change l'userId via le front

  // On va chercher le livre
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérifie que c'est bien le créateur du livre
      if (book.userId !== req.auth.userId) { // si l'id de ce qu'on vient de récupérer est différent de celui du token, erreur)
        return res.status(401).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre' });
      }

      // Mise à jour du livre
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
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
