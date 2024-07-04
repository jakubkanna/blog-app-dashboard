/**
 * TODO:
 *
 * Images column,
 * Tags column,
 *
 *
 *  dispaly format of date
 *
 * Display of external link
 */
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import CRUDTable from "../components/CRUDTable";
import { useEventsContext } from "../contexts/pagesContexts/EventsContext";
import EditorModal from "../components/editor/EditorModal";
import ImagesModal from "../components/ImagesModal";
import { Link } from "react-router-dom";
import { ExternalLink, LinkIcon } from "lucide-react";

export default function Events() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/posts/");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const postOptions = [
    { title: "-", id: "" },
    ...posts.map((post) => ({
      title: post.title,
      id: post._id,
    })),
  ];

  const TextModalCell = ({ params }) => {
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
        {editing && <EditorModal params={params} onClose={handleClose} />}
      </>
    );
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
        {editing && <ImagesModal onClose={handleClose} params={params} />}
      </>
    );
  };

  const renderExternalLinks = (params) => {
    if (!params.value || params.value.length === 0) return null;

    return (
      <>
        {params.value.map((link, index) => (
          <ExternalLink key={index} href={link} />
        ))}
      </>
    );
  };

  const eventColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    {
      field: "subtitle",
      headerName: "Subtitle",
      flex: 1,
      editable: true,
      renderEditCell: (params) => <TextModalCell params={params} />,
      valueFormatter: (v) => (v ? v.replace(/<[^>]*>?/gm, "") : ""),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
      renderEditCell: (params) => <TextModalCell params={params} />,
      valueFormatter: (v) => (v ? v.replace(/<[^>]*>?/gm, "") : ""),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,

      valueFormatter: (value) => {
        if (!value) return "N/A";
        const isoDate = new Date(value);
        const formattedDate = isoDate.toLocaleDateString();
        return formattedDate;
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        const isoDate = new Date(value);
        const formattedDate = isoDate.toLocaleDateString();
        return formattedDate;
      },
    },
    { field: "venue", headerName: "Venue", flex: 1, editable: true },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      renderEditCell: (params) => <ImageCell params={params} />,
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      editable: true,
      cellEditorParams: {
        separator: ",",
      },
      valueFormatter: (value) => {
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value;
      },
      valueParser: (value) => {
        if (typeof value === "string") {
          return value.split(",").map((tag) => tag.trim().toLowerCase());
        }
        return value;
      },
    },
    {
      field: "external_url",
      headerName: "Ext. Link",
      flex: 1,
      editable: true,
    },

    {
      field: "post",
      headerName: "Post",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: postOptions,
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.title,
      valueGetter: (value) => {
        if (!value) {
          return postOptions.length > 0 ? postOptions[0].id : "";
        }
        return value;
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

  return (
    <div>
      <CRUDTable columns={eventColumns} context={useEventsContext} />
    </div>
  );
}
