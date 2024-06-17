import { useWorks } from "../hooks/useWorks";
import CRUDTable from "../components/CRUDTable";

const workColumns = [
  { field: "title", headerName: "Title", flex: 1, editable: true },
  { field: "medium", headerName: "Medium", flex: 1, editable: true },
  { field: "year", headerName: "Year", flex: 1, editable: true },
  { field: "images", headerName: "Images", flex: 1, editable: true },
  { field: "events", headerName: "Events", flex: 1, editable: true },
];

function Works() {
  return <CRUDTable columns={workColumns} useDataHook={useWorks} />;
}

export default Works;
