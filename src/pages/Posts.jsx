import MuiTable from "../components/MuiTable";
import { usePostsContext } from "../contexts/pagesContexts/PostsContext";

function Posts() {
  const postColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },

    {
      field: "public",
      headerName: "Public",
      editable: true,
      type: "boolean",
    },
  ];
  return <MuiTable columns={postColumns} context={usePostsContext} />;
}

export default Posts;
