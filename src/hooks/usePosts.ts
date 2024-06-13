import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";

export type Post = {
  id: string;
  author: string;
  timestamp: string;
  title: string;
  data: string;
  public: boolean;
  slug: string;
  modified?: string;
};

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  const { showMessage } = useContext(MessageContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        const postData = await response.json();

        showMessage({ message: postData.message, response });

        const posts: Post[] = postData.map((post: any) => ({
          id: post._id,
          author: post.author,
          timestamp: new Date(post.timestamp).toISOString().substring(0, 10),
          title: post.title,
          data: post.data,
          public: post.public,
          slug: post.slug,
          modified: post.modified
            ? new Date(post.modified).toISOString().substring(0, 10)
            : undefined,
        }));
        setPosts(posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const updatePost = async (
    postId: string,
    columnId: string,
    value: string
  ) => {
    const requestBody = {
      [`${columnId}`]: value,
    };
    console.log("reqbody:", requestBody);
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/update/${postId}`,
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

      showMessage({ message: responseData.message, response });
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const endpoint = `http://localhost:3000/api/posts/delete/${postId}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({}),
      });
      const message = await response.json();

      showMessage({ message: message.message, response: response });

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  return { posts, loading, error, updatePost, deletePost };
};
