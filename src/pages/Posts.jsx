import CRUDTable from "../components/CRUDTable";
import { usePosts } from "../hooks/usePosts";

const workColumns = [
  { field: "title", headerName: "Title", flex: 1, editable: true },
  {
    field: "timestamp",
    headerName: "Timestamp",
    flex: 1,
    editable: false,
    valueFormatter: (value) => {
      const date = new Date(value);
      return date.toLocaleDateString();
    },
  },
  {
    field: "public",
    headerName: "Public",
    flex: 1,
    editable: true,
    type: "checkbox",
  },
];

function Posts() {
  return <CRUDTable columns={workColumns} useDataHook={usePosts} />;
}

export default Posts;
