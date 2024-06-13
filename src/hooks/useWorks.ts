import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { MessageContext } from "../contexts/MessageContext";

export type Work = {
  id: string;
  title: string;
  medium: string[];
  year: number;
  images: string[];
  events: string[];
};

export const useWorks = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);
  const { showMessage } = useContext(MessageContext);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/works/");
        const workData = await response.json();

        showMessage({ message: workData.message, response });

        const works: Work[] = workData.map((work: any) => ({
          id: work._id,
          title: work.title,
          medium: work.medium,
          year: work.year,
          images: work.images,
          events: work.events,
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

  const updateWork = async (
    workId: string,
    columnId: string,
    value: unknown
  ) => {
    const requestBody = {
      [`${columnId}`]: value,
    };

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

      const responseData = await response.json();

      showMessage({ message: responseData.message, response });
    } catch (error) {
      console.error(error);
    }
  };

  return { works, loading, error, updateWork };
};
