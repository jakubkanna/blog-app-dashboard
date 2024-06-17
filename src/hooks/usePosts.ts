import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/posts/");
        const postData = await response.json();

        const fetchedPosts: Post[] = postData.map((post: any) => ({
          id: post._id,
          _id: post._id,
          title: post.title,
          timestamp: new Date(post.timestamp),
          public: post.public,
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const updatePost = async (newPost: Post): Promise<Post> => {
    const requestBody = { ...newPost };
    const postId = requestBody.id;

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

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const updatedPost: Post = await response.json();

      return { ...updatedPost, id: updatedPost._id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createPost = async (newPost: Post): Promise<Post> => {
    const requestBody = { ...newPost };
    try {
      const response = await fetch("http://localhost:3000/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const createdPost: any = await response.json();

      const postWithId: Post = {
        ...createdPost,
        id: createdPost._id,
        timestamp: new Date(createdPost.timestamp),
      };

      return postWithId;
    } catch (error) {
      console.error(error);
      throw error;
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    data: posts,
    updateData: updatePost,
    createData: createPost,
    deleteData: deletePost,
    loading,
  };
};
