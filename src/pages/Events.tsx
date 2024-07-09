import dayjs from "dayjs";
import MuiTable from "../components/MuiTable";
import { useEventsContext } from "../contexts/pagesContexts/EventsContext";
import { GridColDef } from "@mui/x-data-grid";

export default function Events() {
  const eventColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },

    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => dayjs(value).format("MMMM D, YYYY"),
    },
    {
      field: "end_date",
      headerName: "End Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => dayjs(value).format("MMMM D, YYYY"),
    },

    {
      field: "public",
      headerName: "Public",
      editable: true,
      type: "boolean",
    },
  ];

  return <MuiTable columns={eventColumns} context={useEventsContext} />;
}
