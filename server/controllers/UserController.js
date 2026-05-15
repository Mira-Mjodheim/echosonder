const User = require('../models/User');
const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'secret-echosonder';
const sign = (userId) => jwt.sign({ userId }, secret(), { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'name, email et password sont requis' });
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
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const valid = await user.isPasswordMatch(password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });
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
    const updates = { ...req.body };
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getProfile, getUsers, getUser, updateUser, deleteUser };
