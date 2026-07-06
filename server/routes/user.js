const express = require('express');
const router = express.Router();
const { register, login, getProfile, getUsers, getUser, updateUser, deleteUser } = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        auth, getProfile);
router.get('/',          auth, getUsers);
router.get('/:id',       auth, getUser);
router.put('/:id',       auth, updateUser);
router.delete('/:id',    auth, deleteUser);

module.exports = router;
