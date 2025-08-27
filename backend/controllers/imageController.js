const Image = require('../models/Image');
const Folder = require('../models/Folder');
const fs = require('fs');
const path = require('path');

exports.uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Verify folder exists and belongs to user
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const image = new Image({
      name,
      fileName: req.file.filename,
      filePath: `uploads/${req.file.filename}`,
      folderId,
      userId,
      fileSize: req.file.size,
      mimetype: req.file.mimetype
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
     console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folderId } = req.query;

    const images = await Image.find({
      userId,
      folderId
    }).populate('folderId', 'name path').sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const images = await Image.find({
      userId,
      name: { $regex: query, $options: 'i' }
    }).populate('folderId', 'name path').sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const image = await Image.findOne({ _id: id, userId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(image.filePath)) {
      fs.unlinkSync(image.filePath);
    }

    await Image.findByIdAndDelete(id);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
