import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export type Event = {
  id: string;
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  venue?: string;
  tags: string[];
  images: string[];
  post?: string;
  external_url: string;
  public: boolean;
};

type EventsContextType = {
  data: Event[];
  updateData: (newRow: Event) => Promise<Event>;
  createData: (newRow: Event) => Promise<Event>;
  deleteData: (eventId: string) => void;
  loading: boolean;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEventsContext must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(AuthContext);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/events/");
      const eventData = await response.json();

      const fetchedEvents: Event[] = eventData.map((event: any) => ({
        id: event._id,
        _id: event._id,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        start_date: new Date(event.start_date), // Ensure date is converted properly
        end_date: event.end_date ? new Date(event.end_date) : undefined, // Convert if exists
        venue: event.venue,
        tags: event.tags,
        images: event.images,
        post: event.post,
        external_url: event.external_url,
        public: event.public,
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (newRow: Event): Promise<Event> => {
    const requestBody = {
      ...newRow,
      post: newRow.post === "" ? null : newRow.post,
    };

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
      updatedEvent.id = updatedEvent._id;

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
      return updatedEvent;
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

      setEvents((prevEvents) => [...prevEvents, eventWithId]);

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

      // Update local events state by filtering out the deleted event
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents); // Update local state
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        data: events,
        updateData: updateEvent,
        createData: createEvent,
        deleteData: deleteEvent,
        loading,
      }}>
      {children}
    </EventsContext.Provider>
  );
};
