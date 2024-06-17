import { useEvents } from "../hooks/useEvents";
import CRUDTable from "../components/CRUDTable";

const eventColumns = [
  { field: "title", headerName: "Title", flex: 1, editable: true },
  { field: "description", headerName: "Description", flex: 1, editable: true },
  {
    field: "start_date",
    headerName: "Start Date",
    type: "date",
    flex: 1,
    editable: true,
    valueFormatter: (value) => {
      const date = new Date(value);
      return date.toLocaleDateString();
    },
  },
  {
    field: "end_date",
    headerName: "End Date",
    type: "date",
    flex: 1,
    editable: true,
    valueFormatter: (value) => {
      const date = new Date(value);
      return date.toLocaleDateString();
    },
  },
  { field: "venue", headerName: "Venue", flex: 1, editable: true },
  { field: "address", headerName: "Address", flex: 1, editable: true },
  { field: "curators", headerName: "Curators", flex: 1, editable: true },
  { field: "tags", headerName: "Tags", flex: 1, editable: true },
  {
    field: "external_url",
    headerName: "External URL",
    flex: 1,
    editable: true,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
    ),
  },
  {
    field: "post",
    headerName: "Post URL",
    flex: 1,
    editable: true,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
    ),
  },
  { field: "public", headerName: "Public", flex: 1, editable: true },
];

function Events() {
  return <CRUDTable columns={eventColumns} useDataHook={useEvents} />;
}

export default Events;
