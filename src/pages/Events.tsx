import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import MuiTable from "../components/MuiTable";
import { useEventsContext } from "../contexts/pagesContexts/EventsContext";
import EditorModal from "../components/editor/EditorModal";
import ImagesModal from "../components/ImagesModal";
import { ExternalLink } from "lucide-react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";

type Post = {
  title: string;
  _id: string;
};

export default function Events() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts/")
      .then((response) => response.json())
      .then((postsData) => setPosts(postsData))
      .catch((error) => console.error("Failed to fetch posts:", error));
  }, []);

  const postOptions = [
    { title: "-", id: "" },
    ...posts.map((post) => ({ title: post.title, id: post._id })),
  ];

  const ModalCell = ({
    params,
    ModalComponent,
  }: {
    params: GridRenderCellParams;
    ModalComponent: React.ElementType;
  }) => {
    const [editing, setEditing] = useState(false);

    const handleEditClick = () => setEditing(true);
    const handleClose = () => setEditing(false);

    return (
      <>
        <Button variant="contained" size="small" onClick={handleEditClick}>
          Edit
        </Button>
        {editing && <ModalComponent params={params} onClose={handleClose} />}
      </>
    );
  };

  const formatDate = (value: any) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString();
  };

  const formatTags = (value: any) => {
    if (!value) return;
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  const parseTags = (value: any) => {
    if (typeof value === "string") {
      return value.split(",").map((tag) => tag.trim().toLowerCase());
    }
    return value;
  };

  const eventColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    {
      field: "subtitle",
      headerName: "Subtitle",
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderCellParams) => (
        <ModalCell params={params} ModalComponent={EditorModal} />
      ),
      valueFormatter: (value: {
        replace(arg0: RegExp, arg1: string): any;
        value?: string;
      }) => (value ? value.replace(/<[^>]*>?/gm, "") : ""),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderCellParams) => (
        <ModalCell params={params} ModalComponent={EditorModal} />
      ),
      valueFormatter: (value: {
        replace(arg0: RegExp, arg1: string): any;
        value?: string;
      }) => (value ? value.replace(/<[^>]*>?/gm, "") : ""),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value: { value?: string }) => formatDate(value),
    },
    {
      field: "end_date",
      headerName: "End Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value: { value?: string }) => formatDate(value),
    },
    { field: "venue", headerName: "Venue", flex: 1, editable: true },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      renderEditCell: (params: GridRenderCellParams) => (
        <ModalCell params={params} ModalComponent={ImagesModal} />
      ),
      valueFormatter: (value: { length: string; value?: string[] }) =>
        value ? value.length + " images" : "",
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      editable: true,
      valueFormatter: (value: { value?: string[] }) =>
        value ? formatTags(value) : "",
      valueParser: (value?: string) => parseTags(value),
    },
    {
      field: "external_urls",
      headerName: "Ext. Links",
      flex: 1,
      editable: true,
      valueParser: (value?: string) =>
        value ? value.split(",").map((url) => url.trim()) : [],
      renderCell: (params: GridRenderCellParams) => (
        <div>
          {params?.value?.map((url: string, index: number) => (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
            </a>
          ))}
        </div>
      ),
    },
    {
      field: "post",
      headerName: "Post",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: postOptions,
      getOptionValue: (value: any) => value.id,
      getOptionLabel: (value: any) => value.title,
      valueParser: (value: string) => (value ? value : ""),
    },
    {
      field: "public",
      headerName: "Public",
      flex: 1,
      editable: true,
      type: "boolean",
    },
  ];

  return <MuiTable columns={eventColumns} context={useEventsContext} />;
}
