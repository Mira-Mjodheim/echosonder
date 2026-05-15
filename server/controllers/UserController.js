```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');

// Inscription d'un nouvel utilisateur
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const { valid, errors } = validateRegisterInput(username, email, password);
        if (!valid) {
            res.status(400).json(errors);
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ email: 'Cet email est déjà utilisé' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const result = await newUser.save();
        const token = jwt.sign({ userId: result._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { valid, errors } = validateLoginInput(email, password);
        if (!valid) {
            res.status(400).json(errors);
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ email: 'Utilisateur non trouvé' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ password: 'Mot de passe incorrect' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupération des informations de l'utilisateur connecté
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
```