const express = require('express');
const router = express.Router();
const { getLibrary, getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/library', auth, getLibrary);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;