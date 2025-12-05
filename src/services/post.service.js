const Post = require('../models/post.model');

async function createPost({ title, content, author }) {
  const post = await Post.create({ title, content, author });
  return post;
}

async function getPosts() {
  return Post.find().populate('author', 'name email').sort({ createdAt: -1 });
}

async function getPostById(id) {
  return Post.findById(id).populate('author', 'name email');
}

async function updatePost(id, data) {
  return Post.findByIdAndUpdate(id, data, { new: true });
}

async function deletePost(id) {
  return Post.findByIdAndDelete(id);
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
