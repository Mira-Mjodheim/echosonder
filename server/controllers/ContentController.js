const Content = require('../models/Content');
const mongoose = require('mongoose');

const getAllContents = async (req, res) => {
  try {
    const contents = await Content.find()
      .populate('userId', '_id name email')
      .sort('-createdAt');
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des échos' });
  }
};

const getContentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'ID invalide' });
    const content = await Content.findById(req.params.id).populate('userId', '_id name email');
    if (!content) return res.status(404).json({ message: 'Écho non trouvé' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

const createContent = async (req, res) => {
  try {
    const { title, description, audioUrl, duration, mood, tags, type } = req.body;
    if (!title || !title.trim())
      return res.status(400).json({ message: "'title' est requis" });
    const userId = (req.user && req.user.userId)
      ? req.user.userId
      : new mongoose.Types.ObjectId();
    const content = new Content({ title, description, audioUrl, duration, mood, tags, type, userId });
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};

const updateContent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'ID invalide' });
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates._id;
    const content = await Content.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    );
    if (!content) return res.status(404).json({ message: 'Écho non trouvé' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

const deleteContent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'ID invalide' });
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: 'Écho non trouvé' });
    res.json({ message: 'Écho supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

module.exports = { getAllContents, getContentById, createContent, updateContent, deleteContent };
