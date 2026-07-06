const express = require('express');
const router = express.Router();
const {
  getAllContents, getContentById, createContent,
  updateContent, deleteContent, discoverSimilar, discoverByMood,
} = require('../controllers/ContentController');
const auth = require('../middleware/auth');

router.get('/',            getAllContents);
router.get('/discover/mood/:mood',   discoverByMood);
router.get('/discover/similar/:id',  discoverSimilar);
router.get('/:id',         getContentById);
router.post('/',           auth, createContent);
router.put('/:id',         auth, updateContent);
router.delete('/:id',      auth, deleteContent);

module.exports = router;
