const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  lists: [{
    name: { type: String, required: true },
    books: [{
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      description: { type: String, default: 'No description available' },
      cover: { type: String, default: 'https://via.placeholder.com/128x192.png?text=No+Cover' },
      genre: { type: String, default: 'Unknown' },
    }]
  }]
});
module.exports = mongoose.model('User', userSchema);