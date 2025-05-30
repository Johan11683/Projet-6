const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json(error));
    })
    .catch(error => res.status(500).json(error));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(401).json(new Error('Utilisateur non trouvé !'));
      }

      bcrypt.compare(password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json(new Error('Mot de passe incorrect !'));
          }

          const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(200).json({
            userId: user._id,
            token
          });
        })
        .catch(error => res.status(500).json(error));
    })
    .catch(error => res.status(500).json(error));
};
