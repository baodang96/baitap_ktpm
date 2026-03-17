import { useEffect, useState } from "react";
import CreatePost from "./components/CreatePost";

function App() {

  const [posts, setPosts] = useState([]);

  // Lấy danh sách bài viết
  const fetchPosts = async () => {
    const res = await fetch("http://localhost:3001/posts");
    const data = await res.json();
    setPosts(data);
  };

  // Xóa bài viết
  const deletePost = async (id) => {
    await fetch(`http://localhost:3001/posts/${id}`, {
      method: "DELETE"
    });

    fetchPosts();
  };

  // load dữ liệu khi mở trang
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>

      <h1 style={{ textAlign: "center" }}>Simple CMS</h1>

      <CreatePost onPostCreated={fetchPosts} />

      <h2 style={{ textAlign: "center" }}>Posts List</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.content}</td>
              <td>
                <button
                  style={styles.deleteButton}
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

const styles = {

  table: {
    width: "80%",
    margin: "20px auto",
    borderCollapse: "collapse"
  },

  deleteButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }

};

export default App;