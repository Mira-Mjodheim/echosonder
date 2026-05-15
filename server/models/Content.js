const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  audioUrl: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  mood: {
    type: String,
    enum: ['joie', 'mélancolie', 'calme', 'énergie', 'nostalgie', 'mystère', 'autre'],
    default: 'autre'
  },
  tags: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    enum: ['audio', 'ambient', 'vocal', 'instrumental'],
    default: 'audio'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

contentSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Content', contentSchema);
