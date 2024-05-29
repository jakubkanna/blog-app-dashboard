import { useState, useEffect } from "react";
import formatTimestamp from "../lib/formatTimestamp";
import PostStatus from "../components/PostStatus";
import "../styles/Posts.scss";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return { messege: "Failed to fetch posts" };
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch failed:", error.message);
      }
    };

    fetchPosts();
  }, []); // on mount

  return (
    <div className="container">
      <div className="container-head">
        <h2>Posts</h2>
        <button>Add New</button>
      </div>
      <div className="container-body">
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id} className="post-list-item">
              <h2>{post.title}</h2>
              <p>{formatTimestamp(post.timestamp)}</p>
              <p>
                <PostStatus isPublic={post.public} />
              </p>

              <Link to={`/edit/${post._id}`}>
                <Edit />
              </Link>

              <Link to={`/delete/${post._id}`}>
                <Trash />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="container-footer"></div>
    </div>
  );
}
