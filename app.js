const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();

// Importation des routes
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

// CORS (Cross-Origin Resource Sharing)
// Permet de définir les en-têtes pour autoriser l'accès depuis différents domaines
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser toutes les origines
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Autoriser ces en-têtes
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autoriser ces méthodes
  next();
});

// Middleware pour gérer le corps des requêtes en JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Définition des routes API
app.use('/api/books', bookRoutes);  // Routes pour les livres
app.use('/api/auth', userRoutes);   // Routes pour l'authentification

// Exportation de l'app pour l'utiliser dans le fichier server.js (ou autre fichier de démarrage)
module.exports = app;
