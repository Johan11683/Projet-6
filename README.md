# Mon Vieux Grimoire – Back-end d’un site de notation de livres

Projet 6 de la formation Développeur Web – OpenClassrooms  
**Objectif :** Créer une API sécurisée pour gérer un site de notation de livres avec Express et MongoDB.

## Contexte

Dans ce projet, j’ai développé le **back-end** d’une application web de notation de livres.  
Le front-end étant fourni, mon travail a été de :

- Créer une API RESTful complète
- Implémenter l’authentification utilisateur
- Gérer les opérations CRUD sur les livres
- Permettre la notation et le calcul de la moyenne
- Gérer l’upload et l’optimisation des images
- Assurer la sécurité et la performance du code

## Technologies utilisées

- Node.js
- Express.js
- MongoDB & Mongoose
- Multer (upload de fichiers)
- Sharp (optimisation d’image WebP)
- Bcrypt (hash de mots de passe)
- JSON Web Token (authentification)
- Dotenv
- Architecture MVC

## Fonctionnalités principales

- Authentification sécurisée (signup/login via JWT)
- CRUD complet sur les livres (`POST`, `GET`, `PUT`, `DELETE`)
- Ajout de notes par les utilisateurs
- Calcul automatique de la note moyenne
- Téléversement et compression des images avec Sharp
- Sécurité renforcée (headers HTTP, gestion des droits, validations)
- Respect des bonnes pratiques Green Code

## Lancer le projet
```bash
git clone https://github.com/Johan11683/Projet-6.git
```

## Ce que j’ai appris
- Développement d’API RESTful
- Structuration d’un projet back-end en MVC
- Mise en place d’une base MongoDB sécurisée
- Authentification avec JWT
- Téléversement et optimisation d’images avec Sharp
- Protection des routes et validation des droits utilisateur
- Sécurisation des entrées (headers, données, injection)

## Auteur
Développé par Johan MONARD, dans le cadre du projet 6 – Formation Développeur Web chez OpenClassrooms.