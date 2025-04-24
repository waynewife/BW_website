const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ token: 'dummy-token', username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400).json({ message: 'Username already taken' });
    } else {
      const user = new User({ username, password });
      await user.save();
      res.json({ token: 'dummy-token', username });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};