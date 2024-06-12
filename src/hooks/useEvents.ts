import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

export type Event = {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  place?: string;
  curators: string[];
  tags: string[];
  post?: string;
  external_url: string;
  subRows?: Event[];
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const eventData = await response.json();
        const events: Event[] = eventData.map((event: any) => ({
          id: event._id,
          title: event.title,
          start_date: new Date(event.start_date).toISOString().substring(0, 10),
          end_date: event.end_date
            ? new Date(event.end_date).toISOString().substring(0, 10)
            : undefined,
          place: event.place,
          curators: event.curators,
          tags: event.tags,
          post: event.post,
          external_url: event.external_url,
        }));
        setEvents(events);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const updateEvent = async (
    eventId: string,
    columnId: string,
    value: unknown
  ) => {
    const requestBody = {
      [`${columnId}`]: value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/events/update/${eventId}`,
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

  return { events, loading, error, updateEvent };
};
