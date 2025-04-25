const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      username: user.username,
      about: user.about || '',
      isAdmin: user.isAdmin,
      lists: user.lists || [],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { about },
      { new: true }
    );
    res.json({ message: 'Profile updated', about: user.about });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createList = async (req, res) => {
  try {
    const { listName } = req.body;
    const user = await User.findById(req.user.id);
    user.lists.push({ name: listName, books: [] });
    await user.save();
    res.json({ message: 'List created', lists: user.lists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBookToList = async (req, res) => {
  try {
    const { listName, book } = req.body;
    const user = await User.findById(req.user.id);
    const list = user.lists.find(l => l.name === listName);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    list.books.push(book);
    await user.save();
    res.json({ message: 'Book added to list', lists: user.lists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};