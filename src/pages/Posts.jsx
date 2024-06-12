import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import formatTimestamp from "../hooks/formatTimestamp";
import Status from "../components/Status";
import ButtonDelete from "../components/ButtonDelete";
import { Edit } from "lucide-react";
import "../styles/Posts.scss";
import { MessageContext } from "../contexts/MessageContext";

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { id } = useParams();
  const { showMessage } = useContext(MessageContext);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Fetch failed:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  //outlet has it's own context to notify Posts component about change
  const handlePostsChange = async (data, url) => {
    await fetchPosts();
    navigate("/admin/posts");
    showMessage(data, url);
  };

  //diffrent bodies so editor is rendered in diffrent places dynamically
  const CreateBody = () => {
    return (
      <>
        <Outlet context={{ onPostsChange: handlePostsChange }} /> {/*editor*/}
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id} className="post-list-item">
              <h2>{post.title}</h2>
              <p>{formatTimestamp(post.timestamp)}</p>
              <Status isPublic={post.public} />
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
              <ButtonDelete
                props={{
                  data: post,
                  type: "posts",
                  handleCb: handlePostsChange,
                }}
              />
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
              <Outlet
                key={post._id}
                context={{ onPostsChange: handlePostsChange }}
              /> //editor
            ) : (
              <li key={post._id} className="post-list-item">
                <h2>{post.title}</h2>
                <p>{formatTimestamp(post.timestamp)}</p>
                <Status isPublic={post.public} />
                <button
                  className={sessionStorage.getItem(post._id) ? "dirty" : ""}>
                  <Link to={`update/${post._id}`}>
                    <Edit />
                  </Link>
                </button>
                <ButtonDelete
                  props={{
                    data: post,
                    type: "posts",
                    handleCb: handlePostsChange,
                  }}
                />
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
