const Book = require('../models/Books');


// Fonction pour créer un livre
exports.createBook = (req, res) => {
    delete req.body._id;
  
    Book.findOne({ title: req.body.title })
      .then(existingBook => {
        if (existingBook) {
          return res.status(400).json({ message: 'Un livre avec ce titre existe déjà.' });
        }
  
        const book = new Book({
          ...req.body,
          userId: req.auth.userId  // Ajoute l'utilisateur connecté ici !
        });
  
        book.save()
          .then(() => res.status(201).json({ message: 'Livre créé avec succès !' }))
          .catch(error => {
            console.error('Erreur lors de la création du livre :', error);
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
          });
      })
      .catch(error => {
        console.error('Erreur lors de la recherche de livre existant :', error);
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
    // Vérifie si l'utilisateur est bien celui qui a créé le livre
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }

            // Vérifie que l'ID de l'utilisateur correspond à celui du livre
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce livre' });
            }

            // Si l'utilisateur est autorisé, met à jour le livre
            Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
        })
        .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
};


// Fonction pour supprimer un livre
exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
      .then(book => {
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' });
        }
  
        console.log('User ID from token:', req.auth.userId);  // Log de l'ID utilisateur du token
        console.log('Book user ID:', book.userId);  // Log de l'ID utilisateur du livre
  
        // Vérifie que l'utilisateur a créé le livre
        if (book.userId !== req.auth.userId) {
          return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce livre' });
        }
  
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
      })
      .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
  };
  

