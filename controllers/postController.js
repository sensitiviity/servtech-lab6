const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create(req.body);
  return res.status(201).json({ success: true, data: post });
});

const getAllPosts = asyncHandler(async (req, res) => {
  throw new Error('Тестова помилка сервера');
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Post.countDocuments();
  return res.json({ success: true, data: posts, total, page, limit });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
  return res.json({ success: true, data: { ...post.toObject(), comments } });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) throw ApiError.notFound('Post not found');
  return res.json({ success: true, data: post });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound('Post not found');
  await Comment.deleteMany({ postId: req.params.id });
  return res.json({ success: true, message: 'Post and related comments deleted' });
});

const searchPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ $text: { $search: req.query.q } });
  return res.json({ success: true, data: posts });
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  if (!post) throw ApiError.notFound('Post not found');
  return res.json({ success: true, data: post });
});

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, searchPosts, likePost };