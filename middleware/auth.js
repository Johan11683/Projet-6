const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    // Vérifier que l'en-tête Authorization est présent
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json(new Error('Token manquant'));
    }

    // Extraire le token (dans le format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(new Error('Token invalide'));
    }

    // Vérifier le token avec la clé secrète sécurisée depuis .env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'ID de l'utilisateur à la requête pour l'utiliser plus tard
    req.auth = { userId: decodedToken.userId };

    // Passer au prochain middleware ou route
    next();
  } catch (error) {
    return res.status(401).json(error); // Si le token est invalide ou la vérification échoue
  }
};
