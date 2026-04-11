const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const createComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.body.postId);
  if (!post) throw ApiError.notFound('Post not found');
  const comment = await Comment.create(req.body);
  return res.status(201).json({ success: true, data: comment });
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: comments });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: req.body.content },
    { new: true, runValidators: true }
  );
  if (!comment) throw ApiError.notFound('Comment not found');
  return res.json({ success: true, data: comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) throw ApiError.notFound('Comment not found');
  return res.json({ success: true, message: 'Comment deleted' });
});

module.exports = { createComment, getCommentsByPost, updateComment, deleteComment };