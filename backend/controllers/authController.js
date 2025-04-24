const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  console.log('Signup attempt:', { username, password });
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username already taken' });

    const user = new User({ username, password });
    console.log('Saving user:', user);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};