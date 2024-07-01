import { useEffect, useState } from "react";
import CRUDTable from "../components/CRUDTable";
import { useWorksContext } from "../contexts/pagesContexts/WorksContext";

function Works() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/events/")
      .then((response) => response.json())
      .then((eventData) => setEvents(eventData))
      .catch((error) => console.error("Failed to fetch events:", error));
  }, []);

  const eventOptions = [
    { value: "", label: "-" },
    ...events.map((event) => ({
      value: event._id,
      label: event.title,
    })),
  ];

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
      type: "singleSelect",
      valueOptions: eventOptions,
      valueField: "value",
      displayField: "label",
      renderCell: (params) => {
        const selectedEvent = eventOptions.find(
          (option) => option.value === params.value[0]
        );
        return selectedEvent?.label || "";
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
