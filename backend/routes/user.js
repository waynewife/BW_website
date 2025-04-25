const express = require('express');
const router = express.Router();
const { getLibrary, getProfile, updateProfile, uploadBook } = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/library', auth, getLibrary);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/upload-book', auth, upload.single('file'), uploadBook);

module.exports = router;