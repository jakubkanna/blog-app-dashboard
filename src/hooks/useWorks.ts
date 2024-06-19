import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export type Work = {
  id: string;
  _id: string;
  title: string;
  medium: string[];
  year: number;
  images: string[];
  events: string[];
};

export const useWorks = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/works/");
        const workData = await response.json();

        const works: Work[] = workData.map((work: any) => ({
          id: work._id,
          title: work.title,
          medium: work.medium,
          year: work.year,
          images: work.images,
          events: work.events,
          public: work.public,
        }));

        setWorks(works);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  const updateWork = async (newRow: Work): Promise<Work> => {
    const requestBody = { ...newRow };
    const workId = requestBody.id;

    try {
      const response = await fetch(
        `http://localhost:3000/api/works/update/${workId}`,
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
        throw new Error("Failed to update work");
      }

      const updatedWork: Work = await response.json();

      return { ...updatedWork, id: updatedWork._id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createWork = async (newRow: Work): Promise<Work> => {
    const requestBody = { ...newRow };
    try {
      const response = await fetch("http://localhost:3000/api/works/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create work");
      }

      const createdWork: any = await response.json();

      const workWithId: Work = {
        ...createdWork,
        id: createdWork._id,
      };

      return workWithId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteWork = async (workId: number) => {
    try {
      const endpoint = `http://localhost:3000/api/works/delete/${workId}`;

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
        throw new Error(errorData.message || "Failed to delete work");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    data: works,
    updateData: updateWork,
    createData: createWork,
    deleteData: deleteWork,
    loading,
  };
};
