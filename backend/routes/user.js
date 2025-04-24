const express = require('express');
const router = express.Router();
const { getLibrary, getProfile } = require('../controllers/userController');
router.get('/library', getLibrary);
router.get('/profile', getProfile);
module.exports = router;