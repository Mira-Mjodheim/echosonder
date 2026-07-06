const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'secret-echosonder';
const sign = (userId) => jwt.sign({ userId }, secret(), { expiresIn: '7d' });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email et password sont requis' });
  if (!EMAIL_REGEX.test(email))
    return res.status(400).json({ message: 'Format d\'email invalide' });
  if (password.length < PASSWORD_MIN_LENGTH)
    return res.status(400).json({ message: `Le mot de passe doit faire au moins ${PASSWORD_MIN_LENGTH} caractères` });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ token: sign(user._id), user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'email et password sont requis' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    const valid = await user.isPasswordMatch(password);
    if (!valid) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    res.json({ token: sign(user._id), user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getUsers = async (req, res) => {
  try {
    res.json(await User.find().select('-password'));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.params.id !== req.user.userId)
      return res.status(403).json({ message: 'Non autorisé' });
    const updates = { ...req.body };
    delete updates.password;
    delete updates.role;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id !== req.user.userId)
      return res.status(403).json({ message: 'Non autorisé' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getProfile, getUsers, getUser, updateUser, deleteUser };
