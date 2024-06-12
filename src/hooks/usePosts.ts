import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

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
          throw new Error("Failed to fetch data");
        }
        const postData = await response.json();
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
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const updatePost = async (
    postId: string,
    columnId: string,
    value: unknown
  ) => {
    const requestBody = {
      [`${columnId}`]: value,
    };

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

      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return { posts, loading, error, updatePost };
};
