const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  path: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
FolderSchema.index({ userId: 1, parentId: 1 });

module.exports = mongoose.model('Folder', FolderSchema);
