const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const {
  uploadImage,
  getImages,
  searchImages,
  deleteImage
} = require('../controllers/imageController');
const auth = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'image-manager',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.use(auth);
router.post('/upload', upload.single('image'), uploadImage);
router.get('/', getImages);
router.get('/search', searchImages);
router.delete('/:id', deleteImage);

module.exports = router;