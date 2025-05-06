const multer = require('multer');
const path = require('path');

// Types MIME acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // stockage dans le dossier images
  },
  
  // Nom du fichier après téléchargement
  filename: (req, file, callback) => {
    // Enlever l'extension actuelle et remplacer les espaces par des underscores
    const name = file.originalname.split(' ').join('_').replace(/[^a-zA-Z0-9-_\.]/g, ''); 
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  }
});

// Validation du type MIME
const fileFilter = (req, file, callback) => {
  const isValid = MIME_TYPES[file.mimetype];
  if (isValid) {
    callback(null, true);
  } else {
    callback(new Error('Type de fichier non autorisé'), false);
  }
};

module.exports = multer({ 
  storage, 
  fileFilter
}).single('image');