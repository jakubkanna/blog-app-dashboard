import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export type Comment = {
  author: string; // Change the types as per your model
  post: string;
  timestamp: string;
  text: string;
  edited?: string;
};

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments from your API endpoint
        const response = await fetch("http://localhost:3000/api/comments/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const commentData = await response.json();
        console.log(commentData);
        const comments: Comment[] = commentData.map((comment: any) => ({
          author: comment.author.username,
          post: comment.post.title,
          timestamp: new Date(comment.timestamp).toISOString().substring(0, 10),
          text: comment.text,
          edited: comment.edited
            ? new Date(comment.edited).toISOString().substring(0, 10)
            : undefined,
        }));
        setComments(comments);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const updateComment = async (
    commentId: string,
    columnId: string,
    value: unknown
  ) => {
    const requestBody = {
      [`${columnId}`]: value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/update/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return { comments, loading, error, updateComment };
};