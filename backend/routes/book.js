const express = require('express');
const router = express.Router();
const { getBooksByGenre, searchBooks } = require('../controllers/bookController');
router.get('/genre/:genre', getBooksByGenre);
router.get('/search', searchBooks);
module.exports = router;