const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Routing
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');


// Connexion MongoDB
mongoose.connect('mongodb+srv://monardjohan:13092024Anna!@projet6oc.ctslzqn.mongodb.net/',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// JSON
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;
