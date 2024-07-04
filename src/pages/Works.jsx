import { useEffect, useState } from "react";
import CRUDTable from "../components/CRUDTable";
import { useWorksContext } from "../contexts/pagesContexts/WorksContext";
import MultiSelect from "../components/MuiTableMultiselectCell"; // Make sure the import path is correct

function Works() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/events/")
      .then((response) => response.json())
      .then((eventData) => setEvents(eventData))
      .catch((error) => console.error("Failed to fetch events:", error));
  }, []);

  const eventOptions = events.map((event) => ({
    label: event.title,
    id: event._id,
  }));

  const getEventTitles = (ids) => {
    return ids
      .map((id) => {
        const event = events.find((event) => event._id === id);
        return event ? event.title : "Unknown";
      })
      .join(", ");
  };

  const workColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "medium", headerName: "Medium", flex: 1, editable: true },
    { field: "year", headerName: "Year", flex: 1, editable: true },
    { field: "images", headerName: "Images", flex: 1, editable: true },
    {
      field: "events",
      headerName: "Events",
      flex: 1,
      editable: true,
      renderEditCell: (params) => {
        return <MultiSelect params={params} options={eventOptions} />;
      },
      valueFormatter: (value) => {
        if (!value) return "";
        return getEventTitles(value);
      },
    },
    {
      field: "public",
      headerName: "Public",
      flex: 1,
      editable: true,
      type: "boolean",
    },
  ];

  return <CRUDTable columns={workColumns} context={useWorksContext} />;
}

export default Works;
