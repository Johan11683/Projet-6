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
  // Vérification si un fichier est téléchargé (Multer a traité le fichier)
  const bookObject = req.file
    ? {
        // Si un fichier est téléchargé, on traite le livre contenu dans req.body.book (qui est une chaîne JSON)
        ...JSON.parse(req.body.book), // Convertit la chaîne en objet
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Crée l'URL de l'image
      }
    : { ...req.body }; // Sinon, on utilise directement le corps de la requête si aucun fichier n'est envoyé

  // On empêche que quelqu'un modifie l'userId via la requête
  delete bookObject._userId;

  // On va chercher le livre avec l'_id de la requête (req.params.id)
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérifie que l'utilisateur qui modifie le livre est bien celui qui l'a créé
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre' });
      }

      // Mise à jour du livre avec les nouvelles données (imageUrl si fichier, sinon autres données du livre)
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch(error => {
          res.status(400).json({ error });
        });
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
