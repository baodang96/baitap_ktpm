const postRepository = require("../repositories/postRepository");

exports.getPosts = async () => {
  return await postRepository.getAllPosts();
};

exports.createPost = async (title, content) => {
  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  return await postRepository.createPost(title, content);
};

exports.deletePost = async (id) => {
  return await postRepository.deletePost(id);
};