const Book = require('../models/Book');

exports.getBooksByGenre = async (req, res) => {
  const { genre } = req.params;
  try {
    const books = await Book.find({ genre });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchBooks = async (req, res) => {
  const { q } = req.query;
  try {
    const books = await Book.find({ title: new RegExp(q, 'i') });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};