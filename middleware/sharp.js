const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

module.exports = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = path.join(__dirname, '../images', req.file.filename);
  const outputFilename = 'optimized_' + path.parse(req.file.filename).name + '.webp';
  const outputPath = path.join(__dirname, '../images', outputFilename);

  try {
    await fs.access(inputPath); // Vérifie si le fichier existe

    // Convertir l'image
    await sharp(inputPath)
      .resize({ width: 800 })
      .webp({ quality: 80 })
      .toFile(outputPath);

    console.log('Image convertie avec succès en WebP');

    // Supprimer l'image originale après la conversion
    await fs.unlink(inputPath);
    console.log('Image originale supprimée avec succès');

    // Mettre à jour le nom du fichier pour le reste de la requête
    req.file.filename = outputFilename;

    next();
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'image avec Sharp :', error);

    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Le fichier d\'image n\'existe pas.' });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
};
