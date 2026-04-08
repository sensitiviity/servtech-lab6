const Comment = require('../models/Comment');
const Post = require('../models/Post');

async function createComment(req, res) {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comment = await Comment.create(req.body);
    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => ({ field: e.path, msg: e.message }));
      return res.status(400).json({ success: false, message: 'Validation error', errors: details });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getCommentsByPost(req, res) {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: comments });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateComment(req, res) {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    );
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    return res.json({ success: true, data: comment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => ({ field: e.path, msg: e.message }));
      return res.status(400).json({ success: false, message: 'Validation error', errors: details });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    return res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { createComment, getCommentsByPost, updateComment, deleteComment };