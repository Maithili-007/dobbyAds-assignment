const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log('Auth route hit:', req.method, req.originalUrl);
  next();
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

module.exports = router;
