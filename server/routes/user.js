```javascript
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

/**
 * @api {get} /users Liste des utilisateurs
 * @apiName GetUsers
 * @apiGroup Utilisateurs
 * @apiSuccess {Array} users Liste des utilisateurs
 */
router.get('/', UserController.getUsers);

/**
 * @api {get} /users/:id Détails d'un utilisateur
 * @apiName GetUser
 * @apiGroup Utilisateurs
 * @apiParam {String} id Identifiant de l'utilisateur
 * @apiSuccess {Object} user Détails de l'utilisateur
 */
router.get('/:id', UserController.getUser);

/**
 * @api {post} /users Créer un nouvel utilisateur
 * @apiName CreateUser
 * @apiGroup Utilisateurs
 * @apiBody {String} name Nom de l'utilisateur
 * @apiBody {String} email Adresse e-mail de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 * @apiSuccess {Object} user Utilisateur créé
 */
router.post('/', UserController.createUser);

/**
 * @api {put} /users/:id Mettre à jour un utilisateur
 * @apiName UpdateUser
 * @apiGroup Utilisateurs
 * @apiParam {String} id Identifiant de l'utilisateur
 * @apiBody {String} [name] Nom de l'utilisateur
 * @apiBody {String} [email] Adresse e-mail de l'utilisateur
 * @apiBody {String} [password] Mot de passe de l'utilisateur
 * @apiSuccess {Object} user Utilisateur mis à jour
 */
router.put('/:id', UserController.updateUser);

/**
 * @api {delete} /users/:id Supprimer un utilisateur
 * @apiName DeleteUser
 * @apiGroup Utilisateurs
 * @apiParam {String} id Identifiant de l'utilisateur
 * @apiSuccess {String} message Message de confirmation
 */
router.delete('/:id', UserController.deleteUser);

module.exports = router;
```