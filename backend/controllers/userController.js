const User = require('../models/User');
const fs = require('fs');
const path = require('path');

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
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('readingList');
    res.json({
      username: user.username,
      about: user.about || '',
      readingList: user.readingList
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

exports.uploadBook = async (req, res) => {
  try {
    const { title, url } = req.body;
    const user = await User.findById(req.user.id);
    let pdfPath = '';

    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      pdfPath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
      fs.writeFileSync(pdfPath, req.file.buffer);
    } else if (url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      pdfPath = path.join(uploadDir, `${Date.now()}-online.pdf`);
      fs.writeFileSync(pdfPath, response.data);
    }

    const book = { title, pdfPath };
    user.readingList.push(book);
    await user.save();

    res.json({ message: 'Book uploaded', book });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};