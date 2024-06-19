import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export type Event = {
  id: string;
  _id: string;
  title: string;
  subtitle?: string;
  start_date: Date;
  end_date?: Date;
  venue?: string;
  tags: string[];
  images: string[];
  post?: string;
  external_url: string;
  public: boolean;
};

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events/");
        const eventData = await response.json();

        const events: Event[] = eventData.map((event: any) => ({
          id: event._id,
          _id: event._id,
          title: event.title,
          subtitle: event.subtitle,
          start_date: event.start_date,
          end_date: event.end_date,
          venue: event.venue,
          tags: event.tags,
          images: event.images,
          post: event.post,
          external_url: event.external_url,
          public: event.public,
        }));
        setEvents(events);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const updateEvent = async (newRow: Event): Promise<Event> => {
    const requestBody = {
      ...newRow,
      post: newRow.post === "" ? null : newRow.post,
    };
    console.log(requestBody);
    const eventId = requestBody.id;

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update event");
      }

      const updatedEvent: Event = await response.json();

      const eventWithId: Event = {
        ...updatedEvent,
        id: updatedEvent._id,
      };

      return eventWithId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createEvent = async (newRow: Event): Promise<Event> => {
    const requestBody = {
      ...newRow,
      post: newRow.post === "" ? null : newRow.post,
    };

    try {
      const response = await fetch("http://localhost:3000/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const createdEvent: any = await response.json();

      const eventWithId: Event = {
        ...createdEvent.newEvent,
        id: createdEvent.newEvent._id,
      };
      return eventWithId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const endpoint = `http://localhost:3000/api/events/delete/${eventId}`;

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
        throw new Error(errorData.message || "Failed to delete event");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    data: events,
    updateData: updateEvent,
    createData: createEvent,
    deleteData: deleteEvent,
    loading,
  };
};
