import createGenericContext from "../../utils/createGenericContext";
import { Event } from "../../../types";

const eventUrls = {
  fetchUrl: "http://localhost:3000/api/events/",
  createUrl: "http://localhost:3000/api/events/create",
  updateUrl: "http://localhost:3000/api/events/update",
  deleteUrl: "http://localhost:3000/api/events/delete",
};

const { useGenericContext: useEventsContext, Provider: EventsProvider } =
  createGenericContext<Event>(
    eventUrls.fetchUrl,
    eventUrls.createUrl,
    eventUrls.updateUrl,
    eventUrls.deleteUrl
  );

export { useEventsContext, EventsProvider };
