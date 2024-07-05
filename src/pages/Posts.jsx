import MuiTable from "../components/MuiTable";
import { usePostsContext } from "../contexts/pagesContexts/PostsContext";

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
  return <MuiTable columns={postColumns} context={usePostsContext} />;
}

export default Posts;
