const Content = require('../models/Content');
const mongoose = require('mongoose');
const { detectMood, embed, cosineSimilarity } = require('../services/ai');

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

    // Auto-detect mood if not provided
    const finalMood = mood && mood !== 'autre' ? mood : await detectMood(title, description);
    const embedding = await embed(`${title} ${description || ''}`);

    const content = new Content({
      title, description, audioUrl, duration,
      mood: finalMood, tags, type, userId, embedding,
    });
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

    // Regenerate mood + embedding if title/description changed
    if (req.body.title || req.body.description) {
      content.mood = await detectMood(content.title, content.description);
      content.embedding = await embed(`${content.title} ${content.description || ''}`);
    }

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

// ── Discovery: find similar echos ──────────────────────────────────

const discoverSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: 'ID invalide' });

    const source = await Content.findById(id).select('+embedding');
    if (!source || !source.embedding)
      return res.status(404).json({ message: 'Écho source non trouvé ou sans embedding' });

    const candidates = await Content.find({ _id: { $ne: id } })
      .select('+embedding')
      .populate('userId', '_id name email');

    const scored = candidates
      .filter(c => c.embedding && c.embedding.length > 0)
      .map(c => ({
        ...c.toObject(),
        _score: cosineSimilarity(source.embedding, c.embedding),
      }))
      .filter(c => c._score > 0.4)
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);

    for (const c of scored) delete c.embedding;
    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la découverte' });
  }
};

const discoverByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const contents = await Content.find({ mood })
      .populate('userId', '_id name email')
      .sort('-createdAt')
      .limit(20);
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la découverte par mood' });
  }
};

module.exports = {
  getAllContents, getContentById, createContent, updateContent, deleteContent,
  discoverSimilar, discoverByMood,
};
