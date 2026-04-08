const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Заголовок обов'язковий"],
    trim: true,
    maxlength: [200, 'Заголовок не може перевищувати 200 символів']
  },
  content: {
    type: String,
    required: [true, "Вміст обов'язковий"],
    minlength: [10, 'Вміст має бути не менше 10 символів']
  },
  author: {
    type: String,
    required: [true, "Автор обов'язковий"],
    trim: true
  },
  tags: [{ type: String, trim: true }],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);