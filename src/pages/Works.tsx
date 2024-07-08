import { useEffect, useState } from "react";
import MuiTable from "../components/MuiTable";
import { useWorksContext } from "../contexts/pagesContexts/WorksContext";
import { Button } from "@mui/material";
import ImagesModal from "../components/ImagesModal";
import { GridColDef } from "@mui/x-data-grid";
import { Event, Option } from "../../types";

function Works() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/events/")
      .then((response) => response.json())
      .then((eventData) => setEvents(eventData))
      .catch((error) => console.error("Failed to fetch events:", error));
  }, []);

  const eventOptions: Option[] = events.map((event: Event) => ({
    label: event.title,
    value: event._id,
  }));

  const getEventTitles = (ids) => {
    return ids
      .map((id) => {
        const event = events.find((event) => event._id === id);
        return event ? event.title : "Unknown";
      })
      .join(", ");
  };

  const ImageCell = ({ params }) => {
    const [editing, setEditing] = useState(false);

    const handleEditClick = () => {
      setEditing(true);
    };

    const handleClose = () => {
      setEditing(false);
    };

    return (
      <>
        <Button variant="contained" size="small" onClick={handleEditClick}>
          Edit
        </Button>
        {editing && (
          <ImagesModal
            onClose={handleClose}
            params={params}
            fetchPath="works"
          />
        )}
      </>
    );
  };

  const workColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "medium", headerName: "Medium", flex: 1, editable: true },
    { field: "year", headerName: "Year", flex: 1, editable: true },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => {
        return <ImageCell params={params} />;
      },
    },
    { field: "tags", headerName: "Tags", flex: 1, editable: true },

    {
      field: "events",
      headerName: "Events",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => {
        return;
      },
      valueFormatter: (value: any) => {
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

  return <MuiTable columns={workColumns} context={useWorksContext} />;
}

export default Works;
