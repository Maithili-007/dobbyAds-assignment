const express = require('express');
const {
  createFolder,
  getFolders,
  getAllFolders,
  deleteFolder
} = require('../controllers/folderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // Apply auth middleware to all folder routes

router.post('/', createFolder);
router.get('/', getFolders);
router.get('/all', getAllFolders);
router.delete('/:id', deleteFolder);

module.exports = router;
