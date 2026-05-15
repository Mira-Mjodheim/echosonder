# EchoSonder

EchoSonder est une application web qui permet aux utilisateurs de créer et de partager des échos, des sons et des vibrations qui reflètent leurs émotions et leurs pensées.

## Prérequis

* Node.js (version 16 ou supérieure)
* MongoDB (version 4 ou supérieure)
* npm (version 8 ou supérieure)

## Installation

1. Cloner le repository : `git clone https://github.com/votre-repo/echo-sonder.git`
2. Installer les dépendances : `npm install`
3. Créer un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :
	* `MONGO_URI`: l'URI de connexion à votre base de données MongoDB
	* `PORT`: le port sur lequel l'application sera écoutée (par défaut 3000)
4. Lancer l'application : `npm start`

## Démarrage

L'application est accessible à l'adresse `http://localhost:3000` (ou sur le port que vous avez spécifié dans le fichier `.env`).

## Technologie

* Front-end : React
* Back-end : Node.js
* Base de données : MongoDB

## Structure du projet

* `client` : code React pour le front-end
* `server` : code Node.js pour le back-end
* `models` : modèles de données pour MongoDB

## Commandes npm

* `npm start` : lancer l'application
* `npm run build` : construire l'application pour la production
* `npm run test` : exécuter les tests unitaires

## API

L'API est documentée à l'aide de Swagger. Vous pouvez accéder à la documentation à l'adresse `http://localhost:3000/api-docs`.

## Sécurité

* Les mots de passe sont stockés avec un hash bcrypt
* Les données sensibles sont chiffrées avec une clé secrète

## Contributing

Si vous souhaitez contribuer au projet, merci de lire les guidelines de contribution dans le fichier `CONTRIBUTING.md`.