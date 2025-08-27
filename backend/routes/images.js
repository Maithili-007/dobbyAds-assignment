const express = require('express');
const multer = require('multer');
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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Use absolute path
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('File received:', file); // Debug log
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.use(auth); // Apply auth middleware to all image routes

// Add debug middleware
router.post('/upload', (req, res, next) => {
  console.log('Upload request received');
  console.log('Headers:', req.headers);
  next();
}, upload.single('image'), (req, res, next) => {
  console.log('After multer - req.file:', req.file);
  console.log('req.body:', req.body);
  next();
}, uploadImage);

router.get('/', getImages);
router.get('/search', searchImages);
router.delete('/:id', deleteImage);

module.exports = router;
