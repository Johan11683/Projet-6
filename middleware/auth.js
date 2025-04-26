const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérifier que l'en-tête Authorization est présent
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Extraire le token (dans le format "Bearer <token>")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Vérifier le token avec la clé secrète
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
    

    // Ajouter l'ID de l'utilisateur à la requête pour l'utiliser plus tard
    req.auth = { userId: decodedToken.userId };

    // Passer au prochain middleware ou route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé' }); // Si le token est invalide ou la vérification échoue
  }
};
