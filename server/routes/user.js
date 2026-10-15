const express = require('express');
const router = express.Router();
const {
  register, login, getProfile, getUsers, getUser, updateUser, deleteUser,
  followUser, unfollowUser, getFeed,
} = require('../controllers/UserController');
const auth = require('../middleware/auth');

router.post('/register',    register);
router.post('/login',       login);
router.get('/me',           auth, getProfile);
router.get('/feed',         auth, getFeed);
router.get('/',             auth, getUsers);
router.get('/:id',          auth, getUser);
router.put('/:id',          auth, updateUser);
router.delete('/:id',       auth, deleteUser);
router.post('/:id/follow',  auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);

module.exports = router;
