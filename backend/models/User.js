const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  ongoingReads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});
module.exports = mongoose.model('User', userSchema);