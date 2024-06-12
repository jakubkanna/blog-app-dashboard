import { useCallback, useEffect, useState } from "react";

export default function Comments() {
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Fetch failed:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="container">
      <div className="container-head">
        <h2>Comments</h2>
      </div>
      <div className="container-body">
        {" "}
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-list-item">
              {comment.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="container-footer"></div>
    </div>
  );
}
