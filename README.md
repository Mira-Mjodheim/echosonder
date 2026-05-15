# EchoSonder

EchoSonder est une plateforme web pour créer et partager des **échos sonores** — des enregistrements audio qui reflètent vos émotions, vos pensées, et vos vibrations intérieures.

## Technologies

- **Front-end** : React 18
- **Back-end** : Node.js / Express
- **Base de données** : MongoDB (Mongoose)
- **Auth** : JWT + bcrypt

## Prérequis

- Node.js 16+
- MongoDB 5+
- npm 8+

## Installation

```bash
git clone https://github.com/Mira-Mjodheim/echosonder.git
cd echosonder
npm install
```

Créer un fichier `.env` à la racine :

```
MONGO_URI=mongodb://localhost:27017/echosonder
PORT=3001
JWT_SECRET=votre-secret-jwt
CORS_ORIGIN=http://localhost:3000
```

## Démarrage

```bash
# Serveur API (port 3001)
npm start

# Front-end React (port 3000, dans un second terminal)
npm run client
```

## Structure

```
├── client/          # Application React
│   └── src/
│       ├── components/  # ContentEditor, ContentList, UserProfile
│       └── containers/  # App
├── server/          # API Express
│   ├── controllers/ # ContentController, UserController
│   ├── middleware/  # auth (JWT)
│   ├── models/      # Content, User
│   └── routes/      # /api/contents, /api/users
└── tests/           # Tests serveur (Jest + Supertest)
```

## API

### Authentification

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/users/register` | Inscription |
| POST | `/api/users/login` | Connexion → renvoie un JWT |
| GET | `/api/users/me` | Profil (auth requis) |

### Échos

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/contents` | Liste tous les échos |
| GET | `/api/contents/:id` | Détail d'un écho |
| POST | `/api/contents` | Créer un écho (auth requis) |
| PUT | `/api/contents/:id` | Modifier un écho (auth requis) |
| DELETE | `/api/contents/:id` | Supprimer un écho (auth requis) |

### Modèle d'un écho

```json
{
  "title": "Pluie sur les toits",
  "description": "Ce que j'entends depuis ma fenêtre un soir de novembre",
  "audioUrl": "https://cdn.example.com/echos/pluie.mp3",
  "duration": 42,
  "mood": "mélancolie",
  "tags": ["pluie", "urbain", "nuit"],
  "type": "ambient"
}
```

`mood` : `joie | mélancolie | calme | énergie | nostalgie | mystère | autre`
`type` : `audio | ambient | vocal | instrumental`

## Tests

```bash
npm test
```
