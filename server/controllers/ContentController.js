const Content = require('../models/Content');
const mongoose = require('mongoose');

const OWNERSHIP_ERROR = { message: 'Non autorisé — cet écho ne vous appartient pas' };

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
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
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
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Écho non trouvé' });
    if (content.userId.toString() !== req.user.userId)
      return res.status(403).json(OWNERSHIP_ERROR);
    Object.assign(content, req.body);
    content.updatedAt = new Date();
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
};

const deleteContent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'ID invalide' });
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Écho non trouvé' });
    if (content.userId.toString() !== req.user.userId)
      return res.status(403).json(OWNERSHIP_ERROR);
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Écho supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};

module.exports = { getAllContents, getContentById, createContent, updateContent, deleteContent };
