```javascript
const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const User = require('../models/User');
const { validateContent } = require('../utils/validators');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const contents = await Content.find().populate('author', '_id name');
        res.json(contents);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contenus' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de contenu invalide' });
        }
        const content = await Content.findById(id).populate('author', '_id name');
        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération du contenu' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validateContent(req.body);
        if (error) {
            return res.status(400).json({ message: 'Données invalides', details: error.details[0].message });
        }
        const content = new Content({ ...req.body, author: req.user._id });
        await content.save();
        res.status(201).json(content);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création du contenu' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de contenu invalide' });
        }
        const { error } = validateContent(req.body);
        if (error) {
            return res.status(400).json({ message: 'Données invalides', details: error.details[0].message });
        }
        const content = await Content.findByIdAndUpdate(id, req.body, { new: true });
        if (!content) {
            return res.status(404).json({ message: 'Contenu non trouvé' });
        }
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du contenu' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de contenu invalide' });
        }
        await Content.findByIdAndRemove(id);
        res.json({ message: 'Contenu supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du contenu' });
    }
});

module.exports = router;
```