```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio'],
    required: true
  },
  url: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Content', contentSchema);
```