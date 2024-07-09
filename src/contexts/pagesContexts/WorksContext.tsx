import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { PageContextType, ProviderProps, Work } from "../../../types";

const WorksContext = createContext<PageContextType | undefined>(undefined);

export const useWorksContext = () => {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error("useWorksContext must be used within a WorksProvider");
  }
  return context;
};

export const WorksProvider: React.FC<ProviderProps> = ({ children }) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/works/");

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const worksData = await response.json();

      const fetchedWorks: Work[] = worksData.map((work: Work) => ({
        _id: work._id,
        title: work.title,
        medium: work.medium,
        year: work.year,
        images: work.images,
        events: work.events,
        tags: work.tags,
        public: work.public,
      }));

      setWorks(fetchedWorks);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWork = async (newRow: Work): Promise<Work> => {
    const requestBody = newRow;

    try {
      const response = await fetch(
        `http://localhost:3000/api/works/update/${requestBody._id}`,
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
        throw new Error(errorData.message || "Failed to update work");
      }

      const updatedWork: Work = await response.json();

      setWorks((prevWorks) =>
        prevWorks.map((work) =>
          work._id === updatedWork._id ? updatedWork : work
        )
      );
      return updatedWork;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createWork = async (newRow: Work): Promise<Work> => {
    const requestBody = newRow;
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
        const result = await response.json();
        throw new Error(result.error.message || "Failed to create work");
      }

      const newWork: Work = await response.json();

      setWorks((prevWorks) => [newWork, ...prevWorks]);

      return newWork;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteWork = async (workId: string) => {
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

      // Update local works state by filtering out the deleted work
      const updatedWorks = works.filter((work) => work._id !== workId);
      setWorks(updatedWorks); // Update local state
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <WorksContext.Provider
      value={{
        data: works,
        updateData: updateWork,
        createData: createWork,
        deleteData: deleteWork,
        loading,
      }}>
      {children}
    </WorksContext.Provider>
  );
};
