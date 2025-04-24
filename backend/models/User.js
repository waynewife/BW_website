const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  ongoingReads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});
module.exports = mongoose.model('User', userSchema);