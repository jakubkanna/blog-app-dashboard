import { useState, useEffect } from "react";
import formatTimestamp from "../hooks/formatTimestamp";
import PostStatus from "../components/PostStatus";
import "../styles/Posts.scss";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { Edit } from "lucide-react";
import ButtonDelete from "../components/ButtonDelete";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [dirty, setDirty] = useOutletContext();

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
        <button>
          <Link to={"create"}>Add New</Link>
        </button>
      </div>
      <div className="container-body">
        <Outlet context={[dirty, setDirty]} />
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id} className="post-list-item">
              <h2>{post.title}</h2>
              <p>{formatTimestamp(post.timestamp)}</p>
              <PostStatus isPublic={post.public} />
              <Link to={`/edit/${post._id}`}>
                <Edit />
              </Link>
              <ButtonDelete props={{ data: post, type: "posts" }} />
            </li>
          ))}
        </ul>
      </div>
      <div className="container-footer"></div>
    </div>
  );
}
