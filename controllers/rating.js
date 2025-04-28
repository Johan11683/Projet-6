const Book = require('../models/Books');

exports.addRating = (req, res) => {
    const bookId = req.params.id; // L'ID du livre doit être récupéré ici
    const { userId, rating } = req.body;

    // Vérifier si l'ID est bien défini
    if (!bookId) {
        return res.status(400).json(new Error('L\'ID du livre est manquant'));
    }

    console.log(`Ajout de la note pour le livre ${bookId} par l'utilisateur ${userId} : ${rating}`);

    // Vérifie que la note est bien un nombre entre 0 et 5
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return res.status(400).json(new Error('La note doit être un nombre entre 0 et 5.'));
    }

    // Recherche le livre par son ID
    Book.findOne({ _id: bookId })
        .then(book => {
            if (!book) {
                console.log('Livre non trouvé');
                return res.status(404).json(new Error('Livre non trouvé'));
            }

            // Vérifie si l'utilisateur a déjà noté ce livre
            const alreadyRated = book.ratings.some(rating => rating.userId === userId);
            if (alreadyRated) {
                console.log('L\'utilisateur a déjà noté ce livre');
                return res.status(400).json(new Error('Vous avez déjà noté ce livre.'));
            }

            // Ajoute la nouvelle note au tableau de notations
            book.ratings.push({ userId, grade: rating });

            // Calcul de la nouvelle note moyenne
            const totalRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
            const averageRating = totalRatings / book.ratings.length;
            book.averageRating = averageRating;

            console.log(`Nouvelle note moyenne : ${averageRating}`);

            // Sauvegarde les modifications
            book.save()
            .then(() => {
                console.log('Note ajoutée avec succès');
                // Après la sauvegarde, on recharge le livre mis à jour
                return Book.findById(bookId);
            })
            .then(updatedBook => {
                res.status(200).json(updatedBook);
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la note :', error);
                res.status(500).json(error);
            });

        })
        .catch(error => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(500).json(error);
        });
};

exports.getBestRatedBooks = (req, res) => {
    Book.find()
      .then(books => {
        // Calculer la note moyenne pour chaque livre
        books.forEach(book => {
          const totalRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
          book.averageRating = book.ratings.length ? totalRatings / book.ratings.length : 0;
        });
  
        // Trier les livres par moyenne décroissante
        books.sort((a, b) => b.averageRating - a.averageRating);
  
        // Renvoyer les 3 meilleurs
        res.status(200).json(books.slice(0, 3));
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des meilleurs livres :', error);
        res.status(500).json(error);
      });
};
