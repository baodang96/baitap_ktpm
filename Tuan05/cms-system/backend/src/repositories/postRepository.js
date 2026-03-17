const db = require("../config/db");

exports.getAllPosts = async () => {
  const result = await db.query("SELECT * FROM posts ORDER BY id DESC");
  return result.rows;
};

exports.createPost = async (title, content) => {
  const result = await db.query(
    "INSERT INTO posts(title, content) VALUES($1,$2) RETURNING *",
    [title, content]
  );
  return result.rows[0];
};

exports.deletePost = async (id) => {
  await db.query("DELETE FROM posts WHERE id = $1", [id]);
};