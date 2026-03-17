import { useState } from "react";

function CreatePost({ onPostCreated }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        content: content
      })
    });

    if (response.ok) {
      setTitle("");
      setContent("");
      alert("Post created successfully!");

      if (onPostCreated) {
        onPostCreated();
      }
    } else {
      alert("Error creating post");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Create Post
        </button>

      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  input: {
    width: "95%",
    padding: "10px",
    marginBottom: "10px"
  },
  textarea: {
    width: "95%",
    height: "100px",
    padding: "10px",
    marginBottom: "10px"
  },
  button: {
    width: "95%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none"
  }
};

export default CreatePost;