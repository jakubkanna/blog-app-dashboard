import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { ProviderProps } from "../../../types";

export type Work = {
  _id: string;
  id: string;
  title: string;
  medium: string[];
  year?: number;
  images: string[];
  events: string[];
  tags: string[];
  public: boolean;
  timestamp: Date;
  modified?: Date;
};

type WorksContextType = {
  data: Work[];
  updateData: (newRow: Work) => Promise<Work>;
  createData: (newRow: Work) => Promise<Work>;
  deleteData: (workId: string) => void;
  loading: boolean;
};

const WorksContext = createContext<WorksContextType | undefined>(undefined);

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
      const workData = await response.json();

      const fetchedWorks: Work[] = workData.map((work: any) => ({
        _id: work._id,
        id: work._id,
        title: work.title,
        medium: work.medium,
        year: work.year,
        images: work.images,
        events: work.events,
        tags: work.tags,
        public: work.public,
        timestamp: new Date(work.timestamp),
        modified: work.modified ? new Date(work.modified) : undefined,
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
    const requestBody = {
      ...newRow,
      events: newRow.events.length === 0 ? null : newRow.events,
    };

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update work");
      }

      const updatedWork: Work = await response.json();
      updatedWork.id = updatedWork._id;

      setWorks((prevWorks) =>
        prevWorks.map((work) =>
          work.id === updatedWork.id ? updatedWork : work
        )
      );
      return updatedWork;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createWork = async (newRow: Work): Promise<Work> => {
    const requestBody = {
      ...newRow,
      events: newRow.events.length === 0 ? null : newRow.events,
    };

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

      const createdWork: any = await response.json();

      const workWithId: Work = {
        ...createdWork.newWork,
        id: createdWork.newWork._id,
      };

      setWorks((prevWorks) => [...prevWorks, workWithId]);

      return workWithId;
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
      const updatedWorks = works.filter((work) => work.id !== workId);
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
