const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get user profile (private)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      username: user.username,
      lists: user.lists || [],
      profileReadingList: user.profileReadingList || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public profile by username
router.get('/public-profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password -lists');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      username: user.username,
      profileReadingList: user.profileReadingList || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book to a library list (private)
router.post('/add-book-to-list', auth, async (req, res) => {
  const { listName, book } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const list = user.lists.find(l => l.name === listName);
    if (list) {
      list.books.push(book);
    } else {
      user.lists.push({ name: listName, books: [book] });
    }
    await user.save();
    res.json(user.lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book to profile reading list
router.post('/add-book-to-profile-list', auth, async (req, res) => {
  const { book } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure Profile Reading List exists in lists
    let profileList = user.lists.find(l => l.name === 'Profile Reading List');
    if (!profileList) {
      profileList = { name: 'Profile Reading List', books: [] };
      user.lists.push(profileList);
    }

    profileList.books.push(book);
    user.profileReadingList.push(book);
    await user.save();
    res.json(user.profileReadingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;