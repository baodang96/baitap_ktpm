const postService = require("../services/postService");

exports.getPosts = async (req, res) => {
  const posts = await postService.getPosts();
  res.json(posts);
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = await postService.createPost(title, content);
  res.json(post);
};

exports.deletePost = async (req, res) => {
  await postService.deletePost(req.params.id);
  res.json({ message: "Deleted successfully" });
};