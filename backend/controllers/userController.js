const User = require('../models/User');

exports.getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('savedBooks')
      .populate('ongoingReads');
    res.json({
      saved: user.savedBooks,
      ongoing: user.ongoingReads
    });
  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id)
      .populate('readingList');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Profile user:', user);
    res.json({
      username: user.username,
      about: user.about || '',
      readingList: user.readingList
    });
  } catch (error) {
    console.error('Profile error:', error);
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
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};