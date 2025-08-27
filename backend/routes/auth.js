const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log('Auth route hit:', req.method, req.originalUrl);
  next();
});

router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required'),

    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return array of validation errors with 400 status
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return array of validation errors with 400 status
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  login
);
router.get('/profile', auth, getProfile);

module.exports = router;
