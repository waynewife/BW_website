const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: String,
  title: String,
  author: String,
  description: String,
  cover: String,
  genre: String,
  volumeInfo: Object,
});

const listSchema = new mongoose.Schema({
  name: String,
  books: [bookSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lists: { type: [listSchema], default: [] },
  profileReadingList: { type: [bookSchema], default: [] },
  description: { type: String, default: 'Tap here to add a description about yourself...' }, // Add description field
});

module.exports = mongoose.model('User', userSchema);