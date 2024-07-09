import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Post, ProviderProps } from "../../../types";

type PostsContextType = {
  data: Post[];
  updateData: (newRow: Post) => Promise<Post>;
  createData: (newRow: Post) => Promise<Post>;
  deleteData: (postId: string) => void;
  loading: boolean;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
};

export const PostsProvider: React.FC<ProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/posts/");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const postData = await response.json();

      // Check if postData is an array and not empty
      if (!Array.isArray(postData) || postData.length === 0) {
        setPosts([]); // Set empty array if no posts are returned
        return; // Exit early if no posts are present
      }
      const fetchedPosts: Post[] = postData.map((post: Post) => ({
        _id: post._id,
        author: post.author,
        timestamp: new Date(post.timestamp),
        title: post.title,
        content: post.content,
        public: post.public,
        slug: post.slug,
        modified: post.modified ? new Date(post.modified) : undefined,
        tags: post.tags,
      }));

      setPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (newRow: Post): Promise<Post> => {
    const requestBody = newRow;

    const postId = requestBody._id;

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update post");
      }

      const updatedPost: Post = await response.json();
      updatedPost._id = updatedPost._id;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
      return updatedPost;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createPost = async (newRow: Post): Promise<Post> => {
    const requestBody = newRow;
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
        const result = await response.json();
        throw new Error(result.error.message || "Failed to create post");
      }

      const createdPost: Post = await response.json();

      setPosts((prevPosts) => [createdPost, ...prevPosts]);

      return createdPost;
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

      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        data: posts,
        updateData: updatePost,
        createData: createPost,
        deleteData: deletePost,
        loading,
      }}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
