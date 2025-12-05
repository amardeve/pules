const postService = require('../services/post.service');

async function createPost(req, res, next) {
  try {
    const post = await postService.createPost({ ...req.body, author: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await postService.getPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await postService.deletePost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
