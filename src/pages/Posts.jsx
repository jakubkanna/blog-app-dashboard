import CRUDTable from "../components/CRUDTable";
import { usePosts } from "../hooks/usePosts";

function Posts() {
  const postColumns = [
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
      type: "boolean",
    },
  ];
  return <CRUDTable columns={postColumns} useDataHook={usePosts} />;
}

export default Posts;
