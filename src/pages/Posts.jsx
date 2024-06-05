import { useState, useEffect } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import formatTimestamp from "../hooks/formatTimestamp";
import PostStatus from "../components/PostStatus";
import ButtonDelete from "../components/ButtonDelete";
import { Edit } from "lucide-react";
import "../styles/Posts.scss";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

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
          return { message: "Failed to fetch posts" };
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch failed:", error.message);
      }
    };

    fetchPosts();
  }, []);

  const CreateBody = () => {
    return (
      <>
        <Outlet />
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id} className="post-list-item">
              <h2>{post.title}</h2>
              <p>{formatTimestamp(post.timestamp)}</p>
              <PostStatus isPublic={post.public} />
              <button
                className={
                  sessionStorage.getItem("/admin/posts/update/" + post._id)
                    ? "dirty"
                    : ""
                }>
                <Link to={`update/${post._id}`}>
                  <Edit />
                </Link>
              </button>
              <ButtonDelete props={{ data: post, type: "posts" }} />
            </li>
          ))}
        </ul>
      </>
    );
  };

  const UpdateBody = () => {
    return (
      <>
        <ul className="post-list">
          {posts.map((post) =>
            post._id === id ? (
              <Outlet key={post._id} />
            ) : (
              <li key={post._id} className="post-list-item">
                <h2>{post.title}</h2>
                <p>{formatTimestamp(post.timestamp)}</p>
                <PostStatus isPublic={post.public} />
                <button
                  className={sessionStorage.getItem(post._id) ? "dirty" : ""}>
                  <Link to={`update/${post._id}`}>
                    <Edit />
                  </Link>
                </button>
                <ButtonDelete props={{ data: post, type: "posts" }} />
              </li>
            )
          )}
        </ul>
      </>
    );
  };

  return (
    <div className="container">
      <div className="container-head">
        <h2>Posts</h2>
        <button
          className={
            sessionStorage.getItem("/admin/posts/create") ? "dirty" : ""
          }>
          <Link to={"create"}>Add New</Link>
        </button>
      </div>
      <div className="container-body">
        {id ? <UpdateBody /> : <CreateBody />}
      </div>
      <div className="container-footer"></div>
    </div>
  );
}
