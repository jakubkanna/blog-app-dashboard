import React, { createContext, useState, ReactNode } from "react";
import { Post } from "../../types";
import { useLocation, useParams } from "react-router-dom";

export const EditorContext = createContext<null>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const currentPath = location.pathname;
  const storageKey = currentPath;
  const isUpdatePath = id ? currentPath.includes(id) : false;

  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<
    { id: string; content: string; index: number }[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      if (isUpdatePath && id) {
        try {
          const response = await fetch(`http://localhost:3000/api/posts/${id}`);
          if (response.ok) {
            const newData: Post = await response.json();
            setData(newData);
            setLoading(false);
          } else {
            console.error("Failed to fetch post data");
          }
        } catch (error) {
          console.error("Failed to fetch post data:", error);
        }
      }
    };

    fetchData();
  }, [id, isUpdatePath]);

  return (
    <EditorContext.Provider
      value={{ data, setData, storageKey, loading, blocks, setBlocks }}>
      {children}
    </EditorContext.Provider>
  );
};
