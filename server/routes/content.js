```javascript
const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/ContentController');

/**
 * @route   GET api/content/all
 * @desc    Récupère tous les contenus
 */
router.get('/all', ContentController.getAllContents);

/**
 * @route   GET api/content/:id
 * @desc    Récupère un contenu par son ID
 */
router.get('/:id', ContentController.getContentById);

/**
 * @route   POST api/content
 * @desc    Crée un nouveau contenu
 */
router.post('/', ContentController.createContent);

/**
 * @route   PUT api/content/:id
 * @desc    Met à jour un contenu existant
 */
router.put('/:id', ContentController.updateContent);

/**
 * @route   DELETE api/content/:id
 * @desc    Supprime un contenu par son ID
 */
router.delete('/:id', ContentController.deleteContent);

module.exports = router;
```