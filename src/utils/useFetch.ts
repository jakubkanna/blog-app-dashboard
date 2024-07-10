import { Option } from "../../types";

const useFetchTags = async (): Promise<Option[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/tags/");
    const data = await response.json();
    return data.map((tag: string) => ({
      label: tag,
      value: tag,
    }));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
};

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const useFetchData = <T>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading };
};

const useCreateData = <T>(url: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const createData = async (newItem: T): Promise<T | null> => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error.message || "Failed to create item");
      }

      const createdItem: T = await response.json();
      return createdItem;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createData, loading };
};

const useUpdateData = <T>(url: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const updateData = async (item: T): Promise<T | null> => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/${(item as any)._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update item");
      }

      const updatedItem: T = await response.json();
      return updatedItem;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading };
};

const useDeleteData = (url: string) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const deleteData = async (itemId: string): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete item");
      }

      return true;
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading };
};

export {
  useFetchTags,
  useFetchData,
  useCreateData,
  useUpdateData,
  useDeleteData,
};
