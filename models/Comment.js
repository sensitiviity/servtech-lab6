const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, "Пост обов'язковий"]
  },
  author: {
    type: String,
    required: [true, "Автор обов'язковий"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Вміст коментаря обов'язковий"],
    maxlength: [1000, 'Коментар занадто довгий'],
    trim: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);