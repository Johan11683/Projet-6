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
  // Destination où les fichiers seront enregistrés
  destination: (req, file, callback) => {
    callback(null, 'images'); // dossier images
  },
  
  // Nom du fichier après téléchargement
  filename: (req, file, callback) => {
    // Enlever l'extension actuelle et remplacer les espaces par des underscores
    const name = file.originalname.split(' ').join('_').replace(/[^a-zA-Z0-9-_\.]/g, ''); 
    // Utilisation de path.extname pour obtenir l'extension correcte
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  }
});

// Validation du type MIME
const fileFilter = (req, file, callback) => {
  const isValid = MIME_TYPES[file.mimetype];
  if (isValid) {
    callback(null, true);  // Si valide, continuer
  } else {
    callback(new Error('Type de fichier non autorisé'), false);  // Si invalide, rejeter
  }
};

module.exports = multer({ 
  storage, 
  fileFilter // Ajout de la validation du type MIME
}).single('image'); // Accepter un seul fichier avec le champ "image"