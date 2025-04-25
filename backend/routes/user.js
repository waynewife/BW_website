const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, createList, addBookToList } = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/create-list', auth, createList);
router.post('/add-book-to-list', auth, addBookToList);

module.exports = router;