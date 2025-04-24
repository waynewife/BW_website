const User = require('../models/User');

exports.getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('savedBooks ongoingReads');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username readingList');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};