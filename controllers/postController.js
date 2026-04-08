const Post = require('../models/Post');
const Comment = require('../models/Comment');

async function createPost(req, res) {
  try {
    const post = await Post.create(req.body);
    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => ({ field: e.path, msg: e.message }));
      return res.status(400).json({ success: false, message: 'Validation error', errors: details });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getAllPosts(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Post.countDocuments();
    return res.json({ success: true, data: posts, total, page, limit });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: { ...post.toObject(), comments } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const details = Object.values(err.errors).map(e => ({ field: e.path, msg: e.message }));
      return res.status(400).json({ success: false, message: 'Validation error', errors: details });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await Comment.deleteMany({ postId: req.params.id });
    return res.json({ success: true, message: 'Post and related comments deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function searchPosts(req, res) {
  try {
    const posts = await Post.find({ $text: { $search: req.query.q } });
    return res.json({ success: true, data: posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function likePost(req, res) {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    return res.json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, searchPosts, likePost };